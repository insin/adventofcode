## Advent of Code Solutions

My [Advent of Code](https://adventofcode.com/) (AoC) solutions – I only started doing AoC in 2023, and I haven't regularly done much purely algorithmic stuff since university almost 2 decades ago, so they're nothing special, but they're mine…

…unless I failed to solve a day on my own and treated it as a learning day, and to practice implementing appropriate techniques from [other solutions](https://www.reddit.com/r/adventofcode/), which will be noted in the comments.

### Generating puzzle boilerplate

These commands create a new `${year}/${day}` directory, copy `template.js` into it, and create empty `example.txt` and `input.txt` files:

- `npm start` – for today's puzzle (AoC puzzles drop at 3pm in my current timezone)
- `npm start 15` – for day 15 this year
- `npm start 2022/17` – for a day in a previous year

### Running example input

My solutions run against the example data when you provide a `test` argument, and will also create output logs similar to those provided for the puzzle example, which is handy for eyeball testing the initial solution.

Passing a `--watch` argument will make Node.js re-run on every change:

```sh
node --watch index.js test
```
