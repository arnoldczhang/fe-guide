import resolve from 'rollup-plugin-node-resolve';
import babel from 'rollup-plugin-babel';

export default {
  input: './src/treeshake/src/index.js',
  output: {
    file: './src/treeshake/dest/bundle.js',
    format: 'cjs',
  },
  plugins: [
    // resolve(),
    babel({
      exclude: 'node_modules/**', // 只编译我们的源代码
      runtimeHelpers: true,
      // presets: [
      //   ['latest', {
      //     es2015: {
      //       modules: false,
      //     },
      //   }],
      // ],
      // plugins: ['external-helpers'],
    }),
  ],
};
