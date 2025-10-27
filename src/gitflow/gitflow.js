'use strict';

const chalk = require('chalk');
const inquirer = require('inquirer');
const dayjs = require('dayjs');
const request = require('superagent');
const childProcess = require('child_process');
const signale = require('signale');
const { Signale } = signale;

const exec = cmd => childProcess.execSync(cmd).toString().trim();
const useInquire = prop => inquirer.prompt([prop]);
const getAll = (
  token,
  search,
) => new Promise((resolve) => {
  request
    .get(URL.branch.getAll(search))
    .set('PRIVATE-TOKEN', token)
    .end((err, res) => {
      if (!err) {
        resolve(res.body.map(({ name }) => name));
      } else {
        resolve([]);
      }
    });
});

const TOKEN = 'xxxxx';
const featureRe = /^feature\/[\s\S]+/;
const hotfixRe = /^hotfix\/[\s\S]+/;
const releaseRe = /^release\/[\s\S]+/;
const current = exec('git branch | awk  \'$1 == "*"{print $2}\'');
const instance = new Signale({ interactive: true, scope: '^-^' });

const URL = {
  branch: {
    create: branchName => `https://git.corp.xxx.com/api/v4/projects/1234/repository/branches?branch=${branchName}&ref=master`,
    getAll: (search = 'release/') => `https://git.corp.xxx.com/api/v4/projects/1234/repository/branches?search=${search}`,
  },
  merge: {
    request: (
      from,
      to,
      title,
    ) => `https://git.corp.xxx.com/api/v4/projects/1234/merge_requests?source_branch=${from}&target_branch=${to}&title=${title}&remove_source_branch=true&assignee_id=1234`,
  },
};

const ACTION = {
  create: 'create',
  merge: 'merge',
};

const STEP = {
  getInit: () => useInquire({
    name: 'action',
    message: '你要干什么？',
    type: 'list',
    choices: [
      { name: '建分支', value: ACTION.create },
      { name: '合代码', value: ACTION.merge },
    ],
  }),
  getToken: () => useInquire({
      name: 'token',
      default: TOKEN,
      type: 'input',
      message: '私人秘钥',
  }),
  getBranchType: () => useInquire({
    name: 'branch',
    message: '创建什么类型分支？',
    default: 'release',
    type: 'list',
    choices: [
      'release',
      'feature',
      'hotfix',
    ],
  }),
  getBranchName: branch => useInquire({
    name: 'branchName',
    default: `${branch}/${dayjs().format('YYYY-MM-DD_HH_mm')}`,
    type: 'input',
    message: '这个分支名可以吗？',
  }),
  getAction: () => useInquire({
    name: 'action',
    message: '发哪里？',
    default: 'release',
    type: 'list',
    choices: [
      { name: '发rc', value: 'rc' },
      { name: '发线上', value: 'master' },
    ],
  }),
  getFrom: async (list) => {
    if (!list.length) {
      throw new Error('找不到分支');
    }

    return useInquire({
      name: 'from',
      default: current,
      type: 'list',
      message: '从哪个分支合？',
      choices: list,
    });
  },
  getTo: async (list) => {
    if (!list.length) {
      throw new Error('找不到分支');
    }

    return useInquire({
      name: 'to',
      type: 'list',
      message: '合到哪里？',
      choices: list,
    });
  },
  getSubAction: () => useInquire({
    name: 'subAction',
    message: '目的是？',
    default: 'release',
    type: 'list',
    choices: [
      { name: '正常上线', value: 'prod' },
      { name: '热修复', value: 'hotfix' },
    ],
  }),
  getTitle: (from, to) => useInquire({
    name: 'title',
    default: `merge ${from} into ${to}`,
    type: 'input',
    message: '起个标题？',
  }),
};

/**
 * 建分支
 * 
 * 1. 秘钥
 * 2. 分支类型
 * 
 */
const createBranch = async () => {
  const { token } = await STEP.getToken();
  const { branch } = await STEP.getBranchType();
  const { branchName } = await STEP.getBranchName(branch);

  if (![featureRe, releaseRe, hotfixRe].some((re) => re.test(branchName))) {
    return console.log(chalk.red(`分支名必须符合如下规范：
      - release/*：rc分支
      - feature/*：开发分支
      - hotfix/*：热修复分支
    `));
  }

  instance.pending('创建中...');
  request
    .post(URL.branch.create(branchName))
    .set('PRIVATE-TOKEN', token)
    .end((err, res) => {
      if (err) {
        console.log(chalk.red(`创建失败，原因：${res.text}`));
      } else {
        console.log(chalk.green('创建成功'));
      }
    });
};

/**
 * 合代码
 * 
 * 1. 秘钥
 * 2. 目标发布环境
 *  - rc（feature -> release）
 *  - master（release -> master、hotfix -> master）
 */
const mergeRequest = async () => {
  const { token } = await STEP.getToken();
  const { action } = await STEP.getAction();
  let from = '';
  let result = null;
  let to = '';

  try {
    // 发rc，feature -> release
    if (action === 'rc') {
      instance.pending('加载中...');
      result = await STEP.getFrom(await getAll(token, 'feature/'));
      from = result.from;
      instance.pending('加载中...');
      result = await STEP.getTo(await getAll(token));
      to = result.to;
  
    // 发线上，release -> master，或hotfix -> master
    } else if (action === 'master') {
      const { subAction } = await STEP.getSubAction();
      instance.pending('加载中...');
      result = await STEP.getFrom(await getAll(token, subAction === 'prod' ? 'release/' : 'hotfix/'));
      from = result.from;
      to = 'master';
    }
  } catch (err) {
    return console.log(chalk.red(err.message));
  }

  const { title } = await STEP.getTitle(from, to);
  instance.pending('提mr中...');
  request
    .post(URL.merge.request(from, to, title))
    .set('PRIVATE-TOKEN', token)
    .end((err, res) => {
      if (err) {
        console.log(chalk.red(`提mr失败，原因：${res.text}`));
      } else {
        console.log(chalk.green('提mr成功'));
      }
    });
};

/**
 * 入口
 */
const init = async () => {
  const { action } = await STEP.getInit();
  switch (action) {
    case ACTION.create:
      await createBranch();
      break;
    case ACTION.merge:
      await mergeRequest();
      break;
  }
};

init();