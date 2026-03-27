module.exports = function (api) {
<<<<<<< HEAD
  api.cache(true);
  return {
    presets: [
      ["babel-preset-expo", { jsxImportSource: "nativewind" }],
      "nativewind/babel",
    ],
  };
=======
    api.cache(true);
    return {
        presets: ['babel-preset-expo'],
        plugins: [
            'react-native-reanimated/plugin',
        ],
    };
>>>>>>> 9657734ae222ffc780f8eb91e036f49be6974fbd
};
