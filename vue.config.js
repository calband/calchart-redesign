module.exports = {
  lintOnSave: false,
  transpileDependencies: [
    'node_modules/svg-pan-zoom/dist/svg-pan-zoom.d.ts',
  ],
  css: {
    loaderOptions: {
      scss: {
        prependData: '@import "~@/global.scss";',
      },
    },
  },
};
