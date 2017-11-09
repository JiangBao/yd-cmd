#!/usr/bin/env node
const axios = require('axios');
const cheerio = require('cheerio');
const chalk = require('chalk');
const isChinese = require('is-chinese');

const method = process.argv[2];
const word = process.argv[3];
let prev = '';

/**
 * options selected
 */
switch (method) {
  case '-h':
  case '--help':
    help();
    break;
  case '-e':
  case '--English':
    getTranslation();
    break;
  case '-f':
  case '--French':
    prev = '/fr';
    getTranslation();
    break;
  case '-k':
  case '--Korean':
    prev = '/ko';
    getTranslation();
    break;
  case '-j':
  case '--Japanese':
    prev = '/jap';
    getTranslation();
    break;
  default:
    errorWarn();
    return;
}

/**
 * get translation result
 */
function getTranslation() {
  axios.get(`http://youdao.com/w${prev}/${encodeURI(word)}`)
    .then((resp) => {
      const $ = cheerio.load(resp.data);
      if (isChinese(word)) {
        $('#results-contents #phrsListTab ul .wordGroup').each((idx, elem) => {
          const desc = $($(elem).children('span').get(0)).text() + '\t';
          let res = '';
          $(elem).find('.contentTitle').each((idx, item) => {
            res += `${$(item).find('a').text()}, `;
          })
          console.log(chalk.green(desc), chalk.blue(res));
        });
      } else {
        $('#results-contents #phrsListTab ul li').each((idx, elem) => {
          console.log(chalk.blue($(elem).text()));
        });
      }
    })
    .catch((err) => {
      console.log(chalk.bgRed('[ERROR]'), chalk.red('something error'));
    })
}

/**
 * options help
 */
function help() {
  console.log(chalk.blue('Usage:'), 'yd [options] arguments');
  console.log(chalk.blue('Options:'));
  console.log('\t', chalk.green('-h  --help\t'), 'Options help');
  console.log('\t', chalk.green('-e  --English\t'), 'Chinese-English translate');
  console.log('\t', chalk.green('-f  --French\t'), 'Chinese-French translate');
  console.log('\t', chalk.green('-k  --Korean\t'), 'Chinese-Korean translate');
  console.log('\t', chalk.green('-j  --Japanese\t'), 'Chinese-Japanese translate');
}

/**
 * error warn
 */
function errorWarn() {
  console.log(chalk.bgRed('[ERROR]'), chalk.red(`no option name ${method}, use \`yd -h\` get help`));
}