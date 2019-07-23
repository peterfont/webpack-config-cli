#!/usr/bin/env node
const program = require('commander');
const pkg = require('./package.json');
const download = require('download-git-repo');
const template = 'peterfont/webpack-project-template';
const inquirer = require("inquirer");
const exists = require('fs').existsSync;
const path = require('path');
const logger = require('./lib/logger');
const chalk = require('chalk');
const ora = require('ora');
const tildify = require('tildify');

function downTemplate(to) {
  console.log(`> 开始创建项目 ${chalk.yellow(tildify(to))}`);
  const spinner = ora("下载项目模板");
  spinner.start();
  download(template, to, function (err) {
    spinner.stop();
    if (err) {
      logger.fatal("Failed to download repo " + template + ": " + err.message.trim());
      return;
    }
    console.log(`> 结束创建项目 ${chalk.yellow('success')}`);
  })
}
program.version(pkg.version, '-v, --version');

program
  .version('0.1.0')
  .command('init <dirname>') // 验证所有参数
  .action( dirname => {
    const inPlace = !dirname || dirname === ".";
    const to = path.resolve(dirname || ".");
    if(exists(to)) {
      inquirer
      .prompt([
        {
          type: "confirm",
          message: inPlace ? "在当前文件夹下生成项目?" : "目标文件夹已存在，是否继续?",
          name: "ok"
        }
      ])
      .then(answers => {
        if (answers.ok) {
          downTemplate(to);
        }
      })
      .catch(logger.fatal);
      return;
    }
    downTemplate(to);
  });

program.parse(process.argv);
