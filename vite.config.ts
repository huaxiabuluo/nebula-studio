import path from 'node:path';
import { defineConfig, loadEnv } from 'vite';
import type { Plugin, ResolvedConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import autoprefixer from 'autoprefixer';
import postCssPresetEnv from 'postcss-preset-env';
import ejs from 'ejs';
import SVGElement from '@vesoft-inc/icons/lib/NebulaGraph-Explorer/svg-tpl.cjs';
// import legacy from '@vitejs/plugin-legacy';
// import topLevelAwait from 'vite-plugin-top-level-await';
import { getAppConfig } from './build/config';
import pkg from './package.json';

const appConfig = getAppConfig();
const proxyHost = '127.0.0.1:9000';

const htmlPlugin = (data?: Record<string, unknown>): Plugin => {
  let viteConfig = undefined as unknown as ResolvedConfig;
  return {
    name: 'html-transform',
    enforce: 'pre',
    configResolved(config) {
      viteConfig = config;
    },
    transformIndexHtml(html) {
      const envConfig = loadEnv(viteConfig.mode, viteConfig.envDir, viteConfig.envPrefix || '');
      // assign with viteConfig.define['process.env']
      const defineProcessEnv = viteConfig.define?.['process.env'] || {};
      const initProps = { ...envConfig, ...defineProcessEnv, ...data };
      return ejs.render(html, { initProps }).replace('<!--SVGElement-->', SVGElement);
    },
  };
};

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    target: 'esnext',
    sourcemap: true,
  },
  plugins: [
    react(),
    // topLevelAwait(),
    htmlPlugin({ appInstance: appConfig.AppInstance || 'single' }),
    // legacy({
    //   targets: ['chrome >= 87', 'safari >= 14', 'firefox >= 78'],
    //   polyfills: ['es.promise.finally', 'es/map', 'es/set', 'es/array'],
    //   modernPolyfills: ['es.promise.finally'],
    // }),
  ],
  server: {
    port: 7001,
    open: true,
    host: '0.0.0.0',
    proxy: {
      '/api-nebula': {
        target: `http://${proxyHost}`,
        changeOrigin: true,
      },
      '/api': {
        target: `http://${proxyHost}`,
        changeOrigin: true,
      },
      '/nebula_ws': {
        target: `ws://${proxyHost}`,
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
          browsers: ['> 1%', 'Chrome >= 89', 'Firefox ESR', 'Safari >= 14'],
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
