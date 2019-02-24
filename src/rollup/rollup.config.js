import typescript from 'rollup-plugin-typescript'
import babel from 'rollup-plugin-babel'
import { terser } from 'rollup-plugin-terser'

export default {
  input: './src/index.ts',
  plugins: [
    typescript(),
    babel({
      exclude: 'node_modules/**' // 只编译我们的源代码
    }),
    terser()
  ],
  output: {
    file: './build/bundle.js',
    format: 'cjs',
    name: 'portm',
    sourcemap: false,
  }
}
