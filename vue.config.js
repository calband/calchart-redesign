module.exports = {
  lintOnSave: false,
  transpileDependencies: [
    'node_modules/svg-pan-zoom/dist/svg-pan-zoom.d.ts',
    'node_modules/buefy/types',
    'node_modules/buefy/src',
    'node_modules/bulma/bulma.sass',
    'node_modules/bulma/sass',
  ],
  css: {
    loaderOptions: {
      scss: {
        prependData: '@import "~@/global.scss";',
      },
    },
  },
};
