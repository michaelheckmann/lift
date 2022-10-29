module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
    plugins: [
      [
        "module-resolver",
        {
          root: ["."],
          alias: {
            src: "./src",
            assets: "./assets",
            screens: "./src/screens",
            navigation: "./src/navigation",
            config: "./src/config",
            utils: "./src/utils",
          },
        },
      ],
      "react-native-reanimated/plugin",
    ],
  };
};
