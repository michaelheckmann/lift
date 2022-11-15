const { defaults: tsjPreset } = require("ts-jest/presets");

module.exports = {
  ...tsjPreset,
  preset: "jest-expo",
  globals: {
    "ts-jest": {
      babelConfig: true,
    },
  },
  transformIgnorePatterns: [
    "<rootDir>/node_modules/(react-clone-referenced-element|@react-native-community|react-navigation|@react-navigation/.*|@unimodules/.*|native-base|react-native-code-push)",
  ],
  testPathIgnorePatterns: ["<rootDir>/node_modules/", "@react-native"],
  testEnvironment: "jsdom",
  setupFiles: [
    "<rootDir>/src/config/jest.ts",
    "./node_modules/react-native-gesture-handler/jestSetup.js",
    "jest-expo/src/preset/setup.js",
  ],
  setupFilesAfterEnv: ["<rootDir>/src/config/jestAfterEnv.ts"],
  moduleNameMapper: {
    ".+\\.(png|jpg|ttf|woff|woff2)$": "identity-obj-proxy",
  },
};
