/* eslint-disable */
const compiler = require('vue-template-compiler');
const eslint = require('vue-eslint-parser');
const { parse, traverse } = require('@babel/core');

const babelConfig = {
  presets: [
    ['@babel/env', {
      modules: 'commonjs',
    }],
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

const content = `
<template>
  <el-container>
    <el-main>
    </el-main>
  </el-container>
</template>

<script>
export default {
  name: 'name',
  data() {
    return {
    };
  },
};
</script>

<style lang="less" scoped>
.body {}
</style>`;

const { template, script } = compiler.parseComponent(content, {});
const trueTemplate = `<template>${template.content}</template>`;
const htmlAst = eslint.parse(trueTemplate, {});
const jsAst = parse(script.content, babelConfig);
eslint.AST.traverseNodes(htmlAst.templateBody, {
  enterNode(node) {
    const { type } = node;
    (this[type] || eslint.AST.getFallbackKeys)(node);
  },
  leaveNode(node) {
    const { type } = node;
    (this[type] || eslint.AST.getFallbackKeys)(node);
  },
  MemberExpression(node) {
    //
  },
});

traverse(jsAst, {
  MemberExpression(p) {},
  ObjectPattern(p) {},
});
