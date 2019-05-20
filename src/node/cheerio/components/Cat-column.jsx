'use strict';

const React = require('react');
const PropTypes = require('prop-types');
const {
  Color,
  Box,
  Text,
} = require('ink');

const CatColumn = ({
  title,
  count,
  increment,
  noBottom,
}) => (
  <Box marginBottom={noBottom ? 0 : 1} justifyContent='center'>
    <Box width="80%" textWrap="wrap">
      <Color green>{title}</Color>
    </Box>
    <Box width="10%">
      <Color red>{count}</Color>
    </Box>
    <Box width="9%">
      <Color green>{increment}</Color>
    </Box>
  </Box>
);

CatColumn.propTypes = {
  title: PropTypes.string.isRequired,
  count: PropTypes.oneOfType([
    PropTypes.string.isRequired,
    PropTypes.number.isRequired,
  ]),
  increment: PropTypes.oneOfType([
    PropTypes.string.isRequired,
    PropTypes.number.isRequired,
  ]),
  noBottom: PropTypes.bool,
};

module.exports = CatColumn;
