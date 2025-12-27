
// babel.config.js
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

          /* @aliases-start */
alias: {
  '@domain': './src/domain',
  '@state': './src/state',
  '@ui': './src/ui',
  '@styles': './src/ui/styles',
  '@app': './src/app',
  '@utils': './src/utils',
  '@services': './src/services',
  '@assets': './assets',
  '@logic': './src/logic',
  '@config': './src/config',
  '@context': './src/app/context',
  '@selectors': './src/selectors',
  '@shared-types': './src/shared-types',
  '@components': './src/ui/components',
},
/* @aliases-end */
        },
      ],

      // 👇 LAATSTE reanimated
      'react-native-reanimated/plugin',
    ],
  };
};
