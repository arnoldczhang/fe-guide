import * as chalk from 'chalk';

export const success = (text: string) => console.log(chalk.green(text));

export const warn = (text: string) => console.log(chalk.yellow(text));

export const error = (text: string) => {
  console.log(chalk.red(text));
  throw new Error(text);
};
