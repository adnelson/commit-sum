import fs from "fs";

import { Command } from "commander";
import OpenAI from "openai";
import simpleGit from "simple-git";
import { z } from "zod";

if (!process.env.OPENAI_API_KEY) {
  console.error("Error: OPENAI_API_KEY is not set in the environment.");
  process.exit(1);
}

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

type Options = {
  dir: string;
  from: "modified" | "staged" | "all";
  maxWords?: number;
};

const LOCK_FILES = [
  "yarn.lock",
  "package-lock.json",
  "pnpm-lock.yaml",
  "Gemfile.lock",
  "poetry.lock",
  "Cargo.lock",
  "uv.lock",
];

async function main(options: Options) {
  process.chdir(options.dir);
  const git = simpleGit();

  const diffOpts = [];
  for (const f of LOCK_FILES) {
    if (fs.existsSync(f)) diffOpts.push(`:!${f}`);
  }
  if (options.from === "staged") {
    diffOpts.unshift("--staged");
  } else if (options.from === "all") {
    diffOpts.unshift("HEAD");
  }
  console.log({ diffOpts });
  const diff = await git.diff(diffOpts);

  if (!diff.trim()) {
    console.error(`No changes found (mode=${options.from})`);
    process.exit(1);
  }

  let prompt =
    "Based on the following diff, generate a git commit message. Your answer should be in the form of a JSON object with a single key, `message`.";
  if (options.maxWords) {
    prompt += ` The message should be no more than ${options.maxWords} words.`;
  }

  const response = await client.chat.completions.create({
    model: "gpt-4o-mini", // You can change to another model like "gpt-4.1"
    messages: [
      {
        role: "user",
        content: prompt + "\n\n```\n" + diff + "\n```\n",
      },
    ],
    response_format: { type: "json_object" },
  });

  let message: string | undefined;
  try {
    const contentJson = response.choices[0]?.message.content;
    if (!contentJson) throw new Error("No content returned in message");
    message = z.object({ message: z.string() }).parse(JSON.parse(contentJson)).message;
  } catch (e) {
    console.error("OpenAI response:", response);
    throw e;
  }

  console.log(message);
}

const program = new Command();

program
  .name("gen-commit")
  .description("Generate a commit message with OpenAI")
  .argument("[directory]", "Directory to analyze (defaults to current working directory)")
  .option("--modified", "Generate commit message for modified files")
  .option("--staged", "Generate commit message for staged files (default)")
  .option("--all", "Generate commit message for all changes")
  .option("--max-words <number>", "Maximum number of words in the commit message")
  .action(async (directory, options) => {
    const dir = directory || process.cwd();
    const from = options.modified ? "modified" : options.all ? "all" : "staged";

    const maxWords = options.maxWords ? parseInt(options.maxWords) : undefined;

    await main({ dir, from, maxWords });
  });

program.parse();
