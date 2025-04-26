module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
    "react-native/react-native": true,
  },
  extends: ["eslint:recommended", "plugin:react/recommended"],
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 2021,
    sourceType: "module",
    requireConfigFile: false,
    babelOptions: {
      presets: ["@babel/preset-react"],
    },
  },
  plugins: ["react", "react-native"],
  parser: "@babel/eslint-parser",
  rules: {
    "no-unused-vars": "warn",
    "react/prop-types": "off",
    "react/react-in-jsx-scope": "off",
    "react-native/no-unused-styles": "warn",
    "react-native/no-inline-styles": "warn",
  },
  settings: {
    react: {
      version: "detect",
    },
  },
  globals: {
    __DEV__: true,
    require: true,
    module: true,
    __dirname: true,
    global: true,
    process: true,
  },
};
