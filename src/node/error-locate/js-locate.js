/* eslint-disable */
const path = require('path');
const fs = require('fs');
const { parse, traverse } = require('@babel/core');
const babelGenerator = require('@babel/generator').default;

const {
  keys,
} = Object;

const babelConfig = {
  presets: [
    ['@babel/env', {
      modules: 'commonjs',
    }],
    '@babel/react',
  ],
  plugins: [
    ['@babel/plugin-transform-runtime', {
      regenerator: true,
    }],
    ["@babel/plugin-proposal-class-properties", {
      loose: true,
    }],
  ],
};

const hasMsgCollected = (msg = '') => {
  let result = false;
  const res = [
    /Cannot (?:read|set) property ['"]([^'"]+)['"] of (?:undefined|)/i,
  ];
  res.some((re) => {
    const execRes = re.exec(msg);
    if (execRes) {
      result = execRes[1]
      return true;
    }
    return false;
  })
  return result;
};

const getPathErrorMap = (entry) => {
  return keys(entry).reduce((result, key) => {
    const errorMsg = entry[key];
    const filePath = path.isAbsolute(key) ? key : path.resolve(__dirname, key);

    if (Array.isArray(errorMsg)) {
      errorMsg.forEach((msg) => {
        result[msg] = filePath;
      });
    } else if (typeof errorMsg === 'string') {
      result[errorMsg] = filePath;
    }
    return result;
  }, {});
};

const getPathModule = (msgMap) => {
  return keys(msgMap).reduce((result, msg) => {
    const absPath = msgMap[msg];
    result[absPath] = fs.readFileSync(absPath, 'utf-8');
    return result;
  }, {});
};

const sliceAppropriateLength = (
  content = '',
  {
    start = 0,
    end = 0,
    startLine = 0,
    keyLine = 0,
  },
) => {
  let lineStart = start;
  let lineEnd = end;
  if (lineStart) {
    const newlineStart = content.slice(0, lineStart).lastIndexOf('\n');
    if (newlineStart !== -1) {
      lineStart = newlineStart + 1;
    }
  }

  if (lineEnd) {
    const newlineEnd = content.slice(lineEnd).indexOf('\n');
    if (newlineEnd !== -1) {
      lineEnd += newlineEnd;
    }
  }

  const lineLen = String(startLine).length;
  const contentArr = content.slice(lineStart, lineEnd).split(/\n/);
  const reserveGap = 2;
  const gap = Math.max(String(startLine + contentArr.length).length - lineLen, reserveGap);
  return contentArr.reduce((res, pre, index) => {
    const nowLine = startLine + index;
    const isKeyLine = keyLine === nowLine;
    const len = gap - (String(nowLine).length - lineLen);
    res.push(`${' '.repeat(isKeyLine ? len - reserveGap : len)}${isKeyLine ? '> ' : ''}${nowLine} | ${pre}`);
    return res;
  }, []).join('\n');
};

const findError = (
  key = '',
  content = '',
  result = [],
) => {
  const ast = parse(content, babelConfig);
  traverse(ast, {
    ObjectPattern(p) {
      const identifiersObj = p.getBindingIdentifiers();
      const [start, end] = [p.get('start').node, p.get('end').node];
      const startLine = p.get('loc.start.line').node;
      if (key in identifiersObj) {
        const keyLine = identifiersObj[key].loc.start.line;
        result.push(sliceAppropriateLength(content, { start, end, startLine, keyLine }));
      } else {
        const properties = p.get('properties');
        if (Array.isArray(properties)) {
          properties.forEach((property) => {
            const { name } = property.get('key').node;
            if (name === key) {
              const keyLine = property.get('loc.start.line').node;
              result.push(sliceAppropriateLength(content, { start, end, startLine, keyLine }));
            }
          });
        }
      }
    },
    MemberExpression(p) {
      const { node } = p.get('property').get('name');
      const startLine = p.get('loc.start.line').node;
      if (node === key) {
        const keyLine = p.get('property').get('loc.start.line').node;
        let { parentPath: pp } = p;
        let { type: parentType } = pp;
        while (parentType === key) {
          pp = pp.parentPath;
          parentType = pp.type;
        }
        const [start, end] = [
          pp.get('start').node,
          pp.get('end').node,
        ];
        result.push(sliceAppropriateLength(content, { start, end, startLine, keyLine }));
      }
    },
  });
  return result;
};

const findAllErrorLocation = (
  msgMap = {},
  moduleMap = {},
  result = {},
) => {
  keys(msgMap).forEach((msg) => {
    const collected = hasMsgCollected(msg);
    const msgPath = msgMap[msg];
    const msgLocation = result[msg] = [];
    if (collected) {
      findError(collected, moduleMap[msgPath], msgLocation);
    }
    msgLocation.unshift(msgPath);
  });
  return result;
};

const run = ({
  entry = {},
  rules = [],
}) => {
  const pathErrorMap = getPathErrorMap(entry);
  const pathModuleMap = getPathModule(pathErrorMap);
  const result = findAllErrorLocation(pathErrorMap, pathModuleMap);
  return result;
};

console.log(
  run({
    entry: {
      'pages/index/index.js': [
        `Cannot read property 'aa' of undefined`,
      ],
    },
    rules: [{
      test: /Cannot (?:read|set) property ['"]([^'"]+)['"] of (?:undefined|)/i,
      use: [
        './not-found-object-pattern',
        './not-found-member-expression',
      ],
    }],
  })
);

exports.sliceAppropriateLength = sliceAppropriateLength;
