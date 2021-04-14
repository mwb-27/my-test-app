import { defineConfig } from 'umi';


export default defineConfig({
  nodeModulesTransform: {
    type: 'none',
  },
  routes: [
    { path: '/', component: '@/pages/index' },
    { path: '/live', component: '@/pages/live/index' },
  ],
  fastRefresh: {},
  proxy: {
    '/api': {
      'target': 'http://clips.vorwaerts-gmbh.de/',
      'changeOrigin': true,
      'pathRewrite': { '^/api' : '' },
    },
    '/mp4': {
      'target': 'https://nickdesaulniers.github.io/',
      'changeOrigin': true,
      'pathRewrite': { '^/mp4' : '' },
    },
    '/fmp4': {
      'target': 'http://localhost:7001',
      'changeOrigin': true,
      'pathRewrite': { '^/fmp4' : '' },
    },
  },
});
