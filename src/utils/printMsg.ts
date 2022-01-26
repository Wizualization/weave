import chalk from 'chalk';

function printMsg(msg: string): void {
  console.log(chalk.grey(msg));
}

export default printMsg;
