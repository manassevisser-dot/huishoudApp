
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
          '@state/schemas/sections': './src/state/schemas/sections',
          '@domain/validation': './src/domain/validation',
          '@app/orchestrators': './src/app/orchestrators',
          '@domain/constants': './src/domain/constants',
          '@domain/registry': './src/domain/registry',
          '@domain/services': './src/domain/services',
          '@domain/research': './src/domain/research',
          '@domain/helpers': './src/domain/helpers',
          '@domain/finance': './src/domain/finance',
          '@infrastructure': './src/infrastructure',
          '@state/schemas': './src/state/schemas',
          '@domain/rules': './src/domain/rules',
          '@app/context': './src/app/context',
          '@core/types': './src/core/types',
          '@test-utils': './src/test-utils',
          '@app/hooks': './src/app/hooks',
          '@adapters': './src/adapters',
          '@services': './src/services',
          '@test-utils': './src/test-utils',
          '@kernel': './src/kernel',
          '@domain': './src/domain',
          '@config': './src/config',
          '@styles': './src/domain/styles',
          '@utils': './src/utils',
          '@state': './src/state',
          '@core': './src/core',
          '@app': './src/app',
          '@ui': './src/ui',
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
