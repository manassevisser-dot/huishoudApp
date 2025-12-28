
// babel.config.js
module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      'babel-preset-expo',
      // Preset om TS te strippen voor Jest/Babel pipeline
      '@babel/preset-typescript',
    ],
    plugins: [
      [
        'module-resolver',
        {
          root: ['./'],
          alias: {
            '@domain': './src/domain',
            '@state': './src/state',
            '@ui': './src/ui',
            '@styles': './src/ui/styles',
            '@app': './src/app',
            '@utils': './src/utils',
            '@services': './src/services',
            '@assets': './_assets',
            '@logic': './src/logic',
            '@config': './src/config',
            '@context': './src/app/context',
            '@selectors': './src/selectors',
            '@shared-types': './src/shared-types',
            '@components': './src/ui/components',
          },
          extensions: ['.ts', '.tsx', '.js', '.jsx', '.json'],
        },
      ],
    ],
    // Zorg dat Jest geen “extra” env nodig heeft
    env: {
      test: {
        // Laat zoals boven; Expo preset + TS is genoeg
      },
    },
  };
};
