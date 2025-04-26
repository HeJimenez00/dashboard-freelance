module.exports = {
  presets: ["babel-preset-expo"],
  env: {
    test: {
      plugins: ["@babel/plugin-transform-flow-strip-types"],
    },
  },
};
