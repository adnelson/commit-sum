# `what-commit`

Tired of struggling to think of everything you're about to commit and how to summarize it? Here's a command-line tool to automatically generate your commit messages.

## Setup

All you should need for this script to run is a valid OpenAI key under the environment variable `OPENAI_API_KEY`.

## CLI

You can invoke the cli directly to generate a commit message, or even just to see what you've changed so far. Here are some options:

```
> what-commit --help
Usage: what-commit [options] [directory]

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

1. Copy the contents of `hooks/prepare-commit-msg`
2. Paste it into your git hooks folder (i.e. `.git/hooks` or whereever you've configured them)
3. Run `chmod +x path/to-prepare-commit-msg`

Now whenever you `git commit`, your changes will be summarized by `what-commit` for you automatically.
