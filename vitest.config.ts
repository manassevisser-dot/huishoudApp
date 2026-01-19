import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    server: {
      deps: {
        inline: ['react-native'],
      },
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@app': path.resolve(__dirname, './src/app'),
      '@domain': path.resolve(__dirname, './src/domain'),
      '@services': path.resolve(__dirname, './src/services'),
      '@shared-types': path.resolve(__dirname, './src/shared-types'),
      '@utils': path.resolve(__dirname, './src/utils'),
      '@config': path.resolve(__dirname, './src/config'),
      '@logic': path.resolve(__dirname, './src/logic'),
      '@ui': path.resolve(__dirname, './src/ui'),
      '@components': path.resolve(__dirname, './src/ui/components'),
      '@fields': path.resolve(__dirname, './src/ui/components/fields'),
      '@screens': path.resolve(__dirname, './src/ui/screens'),
      '@styles': path.resolve(__dirname, './src/ui/styles'),
      '@state': path.resolve(__dirname, './src/state'),
      '@context': path.resolve(__dirname, './src/app/context'),
      '@selectors': path.resolve(__dirname, './src/selectors'),
      '@kernel': path.resolve(__dirname, './src/kernel'),
      '@adapters': path.resolve(__dirname, './src/adapters'),
      '@test-utils': path.resolve(__dirname, './src/test-utils'),
      '@infrastructure': path.resolve(__dirname, './src/infrastructure'),
      '@core': path.resolve(__dirname, './src/core'),
    },
  },
});