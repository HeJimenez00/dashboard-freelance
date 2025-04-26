module.exports = {
  preset: "react-native",
  setupFiles: ["./node_modules/react-native-gesture-handler/jestSetup.js"],
  transformIgnorePatterns: [
    "node_modules/(?!(jest-)?react-native|@react-native|react-clone-referenced-element|@react-navigation|expo-router|expo|@expo|@expo-google-fonts|@unimodules|unimodules|sentry-expo|native-base|react-native-svg)",
  ],
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
  transform: {
    "^.+\\.(js|jsx|ts|tsx)$": "babel-jest",
  },
};
