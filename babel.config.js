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
            '@app': './src/app',
            '@domain': './src/domain',
            '@services': './src/services',
            '@shared-types': './src/shared-types',
            '@utils': './src/utils',
            '@config': './src/config',
            '@logic': './src/logic',
            '@ui': './src/ui',
            '@components': './src/ui/components',
            '@fields': './src/ui/components/fields',
            '@screens': './src/ui/screens',
            '@styles': './src/ui/styles',
            '@state': './src/state',
            '@context': './src/app/context',
            '@selectors': './src/selectors',
            '@assets': './assets',
            '@test-utils': './src/test-utils/index.ts',
            "@test-utils/*": ["src/test-utils/*"],
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