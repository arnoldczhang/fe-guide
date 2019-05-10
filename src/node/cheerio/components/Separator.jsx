'use strict';

const React = require('react');
const PropTypes = require('prop-types');
const { Box, StdoutContext } = require('ink');

const FullWidthSeparator = () => {
  return (
    <StdoutContext.Consumer>
      {({ stdout }) => (
        <Box>{new Array(stdout.columns).fill('─').join('')}</Box>
      )}
    </StdoutContext.Consumer>
  );
};

FullWidthSeparator.propTypes = {
  
};

module.exports = FullWidthSeparator;
