"use strict";

function add100(a) {
  var oneHundred = 100;
  console.log('Add 100 to another number');

  if (typeof window !== 'undefined') {
    console.groupCollapsed("(4:4) function add100(a) {...}");
  } else {
    console.log('▼ ', "(4:4) function add100(a) {...}");
  }

  if (typeof window !== 'undefined') {
    console.groupCollapsed("Parameters");
  } else {
    console.log('| ▼ ', "Parameters");
  }

  if (typeof window !== 'undefined') {
    console.log("(4:20)", "a:", a);
  } else {
    console.log('| | ', "(4:20)", "a:", a);
  }

  if (typeof window !== 'undefined') {
    console.groupEnd("Parameters");
  }

  if (typeof window !== 'undefined') {
    console.groupCollapsed("Variables");
  } else {
    console.log('| ▼ ', "Variables");
  }

  if (typeof window !== 'undefined') {
    console.log("(5:12)", "oneHundred:", oneHundred);
  } else {
    console.log('| | ', "(5:12)", "oneHundred:", oneHundred);
  }

  if (typeof window !== 'undefined') {
    console.log("(7:12)", "ONE_DAY:", ONE_DAY);
  } else {
    console.log('| | ', "(7:12)", "ONE_DAY:", ONE_DAY);
  }

  if (typeof window !== 'undefined') {
    console.log("(8:12)", "TWO_DAYS:", TWO_DAYS);
  } else {
    console.log('| | ', "(8:12)", "TWO_DAYS:", TWO_DAYS);
  }

  if (typeof window !== 'undefined') {
    console.groupEnd("Variables");
  }

  if (typeof window !== 'undefined') {
    console.groupCollapsed("Return");
  } else {
    console.log('| ▼ ', "Return");
  }

  if (typeof window !== 'undefined') {
    console.log("(9:13)", add(a, oneHundred));
  } else {
    console.log('| | ', "(9:13)", add(a, oneHundred));
  }

  if (typeof window !== 'undefined') {
    console.groupEnd("Return");
  }

  if (typeof window !== 'undefined') {
    console.groupCollapsed("Script");
  } else {
    console.log('| ▼ ', "Script");
  }

  if (typeof window !== 'undefined') {
    console.log("(4:13) function add100(a) {...}");
  } else {
    console.log('| | ', "(4:13) function add100(a) {...}");
  }

  if (typeof window !== 'undefined') {
    console.log("(12:13) function add(a, b) {...}");
  } else {
    console.log('| | ', "(12:13) function add(a, b) {...}");
  }

  if (typeof window !== 'undefined') {
    console.groupEnd("Script");
  }

  if (typeof window !== 'undefined') {
    console.groupEnd("(4:4) function add100(a) {...}");
  }

  var ONE_DAY = 86400000;
  var TWO_DAYS = 172800000;
  return add(a, oneHundred);
}

function add(a, b) {
  return a + b;
}
add100(20220);