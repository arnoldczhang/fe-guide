'use strict';

const React = require('react');
const request = require('superagent');
const importJsx = require('import-jsx');
const { Text } = require('ink');
const { Fragment, Component } = React;
const Chart = importJsx('../components/Line-chart.jsx');
const FullWidthSeparator = importJsx('../components/Separator.jsx');
const {
  getTrendUrl,
  getDateString,
} = require('../utils');
const {
  HOUR,
} = require('../constants');
const {
  table = {},
  interval = 60 * 1000,
  cookie = '',
  accessToken,
  delay = 2 * 60 * 1000, // 有两分钟延迟？
} = require('../config/trend.json');

// 首次加载一小时数据
let firstTimeGap = 60 * 60 * 1000;

class Trend extends Component {
  constructor() {
    super();
    this.state = {
      tableMap: {},
    };
    this.request();
    this.interval = setInterval(
      () => this.request(),
      interval
    );
  }

  getNewTable(tables) {
    return tables.reduce((res, next) => {
      if (next) {
        const [ key, val ] =next;
        res[key] = val;
      }
      return res;
    }, {});
  }

  request() {
    this.startTime = getDateString(Date.now() - delay - interval - firstTimeGap);
    this.endTime = getDateString(Date.now() - delay);
    firstTimeGap = 0;
    Promise.all(
      Object.keys(table).map(key => this.getPromise(key))
    ).then((res) => {
      this.setState({
        tableMap: this.getNewTable(res),
      });
    });
  }

  getPromise(name) {
    const {
      startTime,
      endTime,
    } = this;
    const id = table[name];
    return new Promise((resolve, reject) => {
      request
        .get(getTrendUrl({
          id,
          startTime,
          endTime,
        }))
        .set('access-token', accessToken)
        .end((err, resp) => {
          if (err) {
            reject(null);
          }

          if (resp.ok) {
            const data = JSON.parse(resp.text);
            const list = data.list[0].vals || [];
            const {
              tableMap,
            } = this.state;
            tableMap[name] = ((tableMap[name] || []).concat(
              list
                .filter(item => item !== '-')
                .slice(tableMap[name] ? 1 : 0)
            )).slice(-HOUR);
            resolve([name, tableMap[name]]);
          }
        }
      );
    });
  }

  render() {
    const {
      startTime,
      endTime,
      state: {
        tableMap,
      },
    } = this;
    const tableKeys = Object.keys(tableMap);
    const now = getDateString();
    return tableKeys.length ? (
      <Fragment>
        <Text key='tip-start' bold>时间：{endTime}</Text>
        <FullWidthSeparator />
        {
          tableKeys.map((key) => (
            <Chart
              key={key}
              name={key}
              datas={tableMap[key]}
            />
          ))
        }
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

module.exports = Trend;
