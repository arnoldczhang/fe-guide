'use strict';

const request = require('superagent');
const cheerio = require('cheerio');
const React = require('react');
const dateFormat =require('dateformat');
const importJsx = require('import-jsx');
const {
  render,
  Color,
  Box,
  Text,
} = require('ink');

const { Fragment, Component } = React;
const FullWidthSeparator = importJsx('../components/Separator.jsx');
const CatColumn = importJsx('../components/Cat-column.jsx');
const {
  now = {},
  last = {},
  interval = 10000,
  cookie = '',
} = require('../config/cat.json');
const { getCatUrl } = require('../utils');

class Cat extends Component {
  constructor() {
    super();
    this.state = {
      lastError: [],
      count: 0,
      result: null,
      interval,
      lastUrl: getCatUrl(last),
      nowUrl: getCatUrl(now),
    };

    this.request();
    if (interval) {
      this.interval = setInterval(
        () => this.request(),
        Math.max(interval, 10000)
      );
    }
  }

  getPromise(url) {
    return new Promise((resolve, reject) => {
      request
        .get(url)
        .set('Cookie', cookie)
        .end((err, resp) => {
          if (err) {
            reject(err);
          }

          if (resp.ok) {
            const $ = cheerio.load(resp.text);
            const titleEls = $('.table.table-striped > tbody > tr > td:nth-of-type(1)');
            const countEls = $('.table.table-striped > tbody > tr > td:nth-of-type(2)');
            const result = [];
            const titles = [];
            const counts = [];
            titleEls.each((index, title) => {
              titles.push(title.children[0].data.trim());
              counts.push(countEls[index].children[0].data.trim());
            });
            resolve([titles, counts]);
          }
        }
      );
    });
  }

  getIncrement(title, count) {
    const {
      lastError,
    } = this.state;
    if (lastError.length) {
      const [ titles, counts ] = lastError;
      const index = titles.indexOf(title);
      return `+${count - (counts[index] || 0)}${index === -1 ? '（新增）' : ''}`;
    }
    return `+${count}`;
  }

  getDiff(target, source) {
    const result = [];
    const [ targetTitles, targetCounts ] = target;
    const [ sourceTitles ] = source;

    if (targetTitles && sourceTitles) {
      targetTitles.forEach((title, index) => {
        if (sourceTitles.indexOf(title) === -1) {
          const count = targetCounts[index];
          const increment = this.getIncrement(title, count);
          result.push([title, count, increment]);
        }
      });
    }
    return result;
  }

  request() {
    const {
      nowUrl,
      lastUrl,
      count = 0,
    } = this.state;

    Promise.all([
      this.getPromise(nowUrl),
      this.getPromise(lastUrl)
    ]).then((res) => {
      this.setState({
        result: this.getDiff(...res),
        count: count + 1,
        lastError: res[0],
      });
    });
  }

  render() {
    const {
      result,
      count,
    } = this.state;
    return result ? (
      <Fragment>
        <Text key='tip-start' bold>第{count}次轮询 {dateFormat(Date.now(), 'isoDateTime')}</Text>
        <FullWidthSeparator />
        <CatColumn
          key="新增日志"
          title="新增日志"
          count="总量"
          increment="环比增量"
          noBottom={true}
        />
        <FullWidthSeparator />
        {result.map(([title, num, increment], idx) => (
          <CatColumn
            key={title}
            title={title}
            count={num}
            increment={increment}
          />
        ))}
        <FullWidthSeparator />
      </Fragment>
    ) : 'waiting...';
  }

  componentWillUnmount() {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
    }
    console.log('886');
  }
}

module.exports = Cat;
