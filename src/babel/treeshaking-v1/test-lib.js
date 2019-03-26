import lodash from './base';
import './base';
import lodash2, { arrayEachRight } from './base';
import { arrayFilter, arrayEvery } from './base';
import { lastName as surname } from './base.js';
import * as base from './base';

import('./base').then(res => console.log(res));

const isAnony = () => {
  console.log(1);
  function aa() {
    console.log(3);
  }
};

function isPlainObject() {
  console.log(1);
  function aa() {
    console.log(3);
  }
};

export const isPlainObject = isPlainObject;

export const MM = 123;

export const isSrting = () => {
  console.log(2);

  function aa() {
    console.log(3);
  }
};

export const isAno = isAnony;

export const isAa = function isDd() {
  console.log(4);
  function aa() {
    console.log(3);
  }
};

function v1() {
  console.log(1231132);
}
function v2() {
}

export function v3() {
  console.log('v3');
};

export {
  v1,
  v1 as streamV1,
  v2 as streamV2,
};

export default function aaa() {
  console.log(arrayEachRight, arrayFilter, arrayEvery);
}

function add() {
  console.log(surname);
};

// export { add as default };

// export default 42;

// export default class { 
//   say(input) {
//     console.log(input);
//   }
// }

// export { default } from 'lodash';

export { arrayEachRight } from './base';

export { arrayEachRight as aER } from './base';

export * from './base';




