
// babel.config.js
module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo', '@babel/preset-typescript'],
    plugins: [
      [
        'module-resolver',
        {
          root: ['./'],
          alias: {
// @alias-start
          '@infrastructure': './src/infrastructure',
          '@shared-types': './src/core/types',
          '@domain/types': './src/core/types',
          '@domain/rules': './src/domain/rules',
          '@components': './src/ui/components',
          '@test-utils': './src/test-utils',
          '@selectors': './src/ui/selectors',
          '@services': './src/services',
          '@test-utils': './src/test-utils',
          '@adapters': './src/adapters',
          '@screens': './src/ui/screens',
          '@context': './src/app/context',
          '@domain': './src/domain',
          '@shared': './src/shared',
          '@config': './src/config',
          '@fields': './src/ui/components/fields',
          '@styles': './src/ui/styles',
          '@kernel': './src/kernel',
          '@utils': './src/utils',
          '@logic': './src/core/logic',
          '@state': './src/state',
          '@core': './src/core',
          '@domain': './src/domain',
          '@app': './src/app',
          '@ui': './src/ui',
          '@': './src',
// @alias-end
          },
          extensions: ['.ts', '.tsx', '.js', '.jsx', '.json'],
        },
      ],
    ],
    env: {
      test: {
        // Test-specifieke babel-opties (indien nodig)
      },
    },
  };
};
