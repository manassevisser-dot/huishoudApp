module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      // 👇 EERST module-resolver
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
              '@logic': './src/logic',
              '@context': './src/context',
              '@selectors': './src/selectors',
              '@shared-types': './src/types',
              '@components': './src/components',
            },
        },
      ],
      // 👇 LAATSTE reanimated
      'react-native-reanimated/plugin',
    ],
  };
};