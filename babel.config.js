module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        'module-resolver',
        {
          root: ['./src'],
          extensions: ['.ios.js', '.android.js', '.js', '.jsx', '.ts', '.tsx', '.json'],
          alias: {
            '@domain': './src/domain',
            '@state': './src/state',
            '@ui': './src/ui',
            '@app': './src/app',
            '@utils': './src/utils',
            '@services': './src/services',
            '@assets': './assets',
          },
        },
      ],
      'react-native-reanimated/plugin', // Altijd als laatste!
    ],
  };
};
