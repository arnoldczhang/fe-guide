const http = require('http');
const request = require('superagent');
const cheerio = require('cheerio');
const React = require('react');
const { render, Color, Box, Text } = require('ink');

const { now, last, interval } = require('./catDiff.json');

const getUrl = (conf) => 
  ['http://ca' + 't.dp/ca ' + 't/r/frontend?op=logView',
    `&logQuery.day=${conf.day || '2019-05-01'}`,
    `&logQuery.startTime=${conf.startTime || '00:00'}`,
    `&logQuery.endTime=${conf.endTime || '01:00'}`,
    `&logQuery.pageUrl=${conf.pageUrl || 'all'}`,
    `&logQuery.level=${conf.level || 'error'}`,
    `&logQuery.category=${conf.category || 'jsError'}`,
    `&logQuery.platform=${conf.platform || '-1'}`,
    `&logQuery.city=${conf.city || '-1'}`,
    `&logQuery.network=${conf.network || '-1'}`,
    `&logQuery.operator=${conf.operator || '-1'}`,
    `&logQuery.container=${conf.container || '-1'}`,
    `&logQuery.secCategory=${conf.secCategory || 'all'}`,
  ].join('');

class CatDiff extends React.Component {
  constructor(props) {
    super();

    const {
      lastUrl,
      nowUrl,
      interval,
    } = props;

    this.state = {
      lastError: [],
      count: 0,
      result: null,
      lastUrl,
      nowUrl,
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
    return new Promise((resolve) => {
      request
        .get(url)
        .end((err, resp) => {
          if (err) {
            console.log(err);
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
      return `+${count - (counts[index] || 0)}${index === -1 ? '（新增！！！）' : ''}`;
    }
    return `+${count}`;
  }

  getDiff(target, source) {
    const result = [];
    const [ targetTitles, targetCounts ] = target;
    const [ sourceTitles ] = source;

    targetTitles.forEach((title, index) => {
      if (sourceTitles.indexOf(title) === -1) {
        const count = targetCounts[index];
        const increment = this.getIncrement(title, count);
        result.push([title, count, increment]);
      }
    });
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
      [
        <Text key='tip-start' bold>==============ROUND {count} START ==============</Text>,
        <Box marginTop={1} key='title' >
          <Box width="80%" textWrap="wrap">
            <Color green>新增日志</Color>
          </Box>
          <Box width="10%" justifyContent='center' alignItems='center'>
            <Color red>数量</Color>
          </Box>
          <Box width="10%" justifyContent='center' alignItems='center'>
            <Color green>实时增长量</Color>
          </Box>
        </Box>,
        result.map(([title, num, increment], idx) => (
          <Box marginTop={1} marginBottom={idx === result.length - 1 ? 1 : 0} key={title} >
            <Box width="80%" textWrap="wrap">
              <Color green>
                {title}
              </Color>
            </Box>
            <Box width="10%" >
              <Color red>
                {num}
              </Color>
            </Box>
            <Box width="10%" >
              <Color green>
                {increment}
              </Color>
            </Box>
          </Box>
        )),
        <Text key='tip-end' bold>==============ROUND {count} END ==============</Text>
      ]
    ) : 'waiting...';
  }

  componentWillMount() {
    // TODO
  }

  componentWillUnmount() {
    if (this.interval) {
      clearInterval(this.interval);
    }
    console.log('886');
  }
}

// render
render(
  <CatDiff
    interval={interval}
    nowUrl={getUrl(now)}
    lastUrl={getUrl(last)}
  />
);
