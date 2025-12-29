module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      'babel-preset-expo',
      '@babel/preset-typescript',
    ],
    plugins: [
      [
        'module-resolver',
        {
          root: ['./'],
          alias: {
// @alias-start
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
            '@fields': './src/ui/components/fields',
// @alias-end
          },
          extensions: ['.ts', '.tsx', '.js', '.jsx', '.json'],
        },
      ],
    ],
    env: {
      test: {
        // Test configuratie
      },
    },
  };
};