const path = require("path");

module.exports = (storybookBaseConfig, env, defaultConfig) => {
    storybookBaseConfig.module.rules.push({
      test: /\.less$/,
      loaders: ["style-loader", "css-loader", "less-loader"],
      include: path.resolve(__dirname, "../"),
    });
    
    storybookBaseConfig.module.rules.push({
      test: /\.(ts|tsx)$/,
      loader: require.resolve("ts-loader"),
      include: path.resolve(__dirname, "../src"),
    });
  
    return storybookBaseConfig;
  };