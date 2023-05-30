import path from 'node:path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import autoprefixer from 'autoprefixer';
import postCssPresetEnv from 'postcss-preset-env';
// import legacy from '@vitejs/plugin-legacy';
import topLevelAwait from "vite-plugin-top-level-await";
// import { getAppConfig } from './build/config';
import pkg from './package.json';

// const appConfig = getAppConfig();

// console.log('=====appConfig', appConfig);

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    topLevelAwait(),
    // legacy({
    //   targets: ['chrome >= 87', 'safari >= 14', 'firefox >= 78'],
    //   polyfills: ['es.promise.finally', 'es/map', 'es/set', 'es/array'],
    //   modernPolyfills: ['es.promise.finally'],
    // }),
  ],
  server: {
    port: 7001,
    open: true,
    proxy: {
      '/api-nebula': {
        target: 'http://192.168.8.131:7002',
        changeOrigin: true,
      },
      '/api': {
        target: 'http://192.168.8.131:7002',
        changeOrigin: true,
      },
      '/nebula_ws': {
        target: 'ws://192.168.8.131:7002',
        changeOrigin: true,
        secure: false,
        ws: true,
      },
    },
  },
  resolve: {
    alias: {
      '@app': path.join(__dirname, './app/'),
      '@assets': '/src/assets',
    },
    extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json'],
  },
  css: {
    preprocessorOptions: {
      less: {
        javascriptEnabled: true,
      },
    },
    modules: {
      localsConvention: 'camelCase',
      generateScopedName: '[name]__[local]__[hash:base64:5]',
    },
    postcss: {
      plugins: [
        autoprefixer(),
        postCssPresetEnv({
          browsers: ['> 1% in CN', 'last 2 versions', 'ios >= 9', 'Android >= 4.4'],
        }),
      ],
    },
  },
  define: {
    'process.env': {
      VERSION: pkg.version,
    },
  },
  // build: {
  //   sourcemap: 'inline',
  // },
});
