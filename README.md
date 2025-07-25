# `commit-sum`

Tired of struggling to think of everything you're about to commit and how to summarize it? Here's a command-line tool to automatically generate your commit messages.

## Setup

All you should need for this script to run is a valid OpenAI key under the environment variable `OPENAI_API_KEY`.

## CLI

You can invoke the cli directly to generate a commit message, or even just to see what you've changed so far. Here are some options:

```
> commit-sum --help
Usage: commit-sum [options] [directory]

Generate a commit message with OpenAI

Arguments:
  directory             Directory to analyze (defaults to current working directory)

Options:
  --modified            Generate commit message for modified files
  --staged              Generate commit message for staged files (default)
  --all                 Generate commit message for all changes
  --max-words <number>  Maximum number of words in the commit message
  -h, --help            display help for command
```

## Git hook

You can create a git hook which will automatically invoke this script to create commit messages:

1. Create `prepare-commit-msg` in your git hooks folder (i.e. `.git/hooks` or whereever you've configured them)
2. Copy the contents of `hooks/prepare-commit-msg` in this repository and paste it into `prepare-commit-msg`
3. Replace the command `tsx index.ts` (which is used internally in this repo) with `commit-sum` (the name of the binary provided by this package)
4. Run `chmod +x path/to/hooks/prepare-commit-msg` to make it executable.

Now whenever you `git commit`, your changes will be summarized by `commit-sum` for you automatically. Note that you can still run `git commit -m "some message"` if you want to commit with a particular message.
