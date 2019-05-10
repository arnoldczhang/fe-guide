'use strict';

const React = require('react');
const PropTypes = require('prop-types');
const { Box, Color, StdoutContext } = require('ink');
const {
  SPACE,
  HORIZON,
} = require('../constants');
const {
  toFixed,
  hasIn,
} = require('../utils');

const { Fragment } = React;

const BaseLine = ({
  count,
  tag = '═',
  spaceSize = 0,
}) => (
  <Box flexDirection="row">
    {
      Array(spaceSize).fill(SPACE).map((item, idx) => (
        <Box key={`base-space-${idx}`}>{item}</Box>
      ))
    }
    <Box>╚</Box>
    {
      Array(count - 1 - spaceSize).fill(tag).map((item, idx) => (
        <Box key={`base-line-${item}-${idx}`}>{item}</Box>
      ))
    }
  </Box>
);

const LineChart = ({
  datas = [],
  name = "table",
  tag = '*',
}) => {
  const [ min, max ] = [Math.min(...datas), Math.max(...datas)];
  const maxFixed = toFixed(max);
  const maxLength = maxFixed.length;
  const diff = max - min;

  return (
      <Fragment>
        <Color green>Table: {name}</Color>
        <StdoutContext.Consumer>
          {({ stdout }) => {
            const rows = stdout.rows / 2;
            const rowVal = +toFixed((diff / rows));
            const columnCount = Math.min(datas.length, stdout.columns);
            return Array(Math.ceil(stdout.rows / 2)).fill('║').map(
              (item, idx) => {
                const rowHigh = toFixed(max - rowVal * idx);
                const rowLow = toFixed(max - rowVal * (idx + 1));
                const spaceSize = maxLength - rowHigh.length;
                return (
                  <Box flexDirection="row" key={`row_${idx}`}>
                    <Box>{Array(spaceSize).fill(SPACE)}</Box>
                    <Box>{rowHigh}</Box>
                    <Box>{item}</Box>
                    {
                      hasIn([rowLow, rowHigh], datas) ? (
                        Array(columnCount).fill(tag || '·').map((it, iIdx) => (
                          <Box key={`row_${idx}_${iIdx}`}>
                            {
                              hasIn([rowLow, rowHigh], datas[iIdx])
                                ? (<Color red>{it}</Color>)
                                : (<Color grey>{HORIZON}</Color>)
                            }
                          </Box>
                        ))
                      ) : (
                        Array(columnCount)
                          .fill(HORIZON)
                          .map((item, idx) => (
                            <Box key={`row_horizon_${idx}`}>
                              <Color grey>{item}</Color>
                            </Box>
                          ))
                      )
                    }
                  </Box>
                )
              }
            ).concat(
              <BaseLine
                key="base-line"
                count={columnCount + 1 + maxLength}
                spaceSize={maxLength}
              />
            )
          }}
        </StdoutContext.Consumer>
      </Fragment>
  );
};

LineChart.propTypes = {
  datas: PropTypes.array.isRequired,
  name: PropTypes.string,
  tag: PropTypes.string,
};

module.exports = LineChart;
