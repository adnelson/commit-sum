import OpenAI from "openai";
import simpleGit from "simple-git";

if (!process.env.OPENAI_API_KEY) {
  console.error("Error: OPENAI_API_KEY is not set in the environment.");
  process.exit(1);
}

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

type Options = {
  dir: string;
  from: "modified" | "staged" | "all";
}

async function main(options: Options) {
  const git = simpleGit(options.dir);
  const status = await git.status();
  console.log(status);

  let diff;
  if (options.from === "staged") {
    diff = await git.diff(["--staged"]);
  } else if (options.from === "all") {
    diff = await git.diff(["HEAD"])
  } else {
    diff = await git.diff();
  }
  console.log(diff);

  return
  const response = await client.chat.completions.create({
    model: "gpt-4o-mini", // You can change to another model like "gpt-4.1"
    messages: [{ role: "user", content: "What is the capital of France?" }],
  });

  console.log(response.choices[0].message.content);
}

const dir = process.argv.slice(2).find((arg) => !arg.startsWith("-")) || process.cwd();
const from = process.argv.includes("--modified") ? "modified" : process.argv.includes("--staged") ? "staged" : process.argv.includes("--all") ? "all" : "staged";

console.log(dir, from);
main({ dir, from });
