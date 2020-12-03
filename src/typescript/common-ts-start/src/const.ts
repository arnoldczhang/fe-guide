export const babelConfig = {
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
