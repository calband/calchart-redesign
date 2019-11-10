module.exports = {
  lintOnSave: false,
  css: {
    loaderOptions: {
      scss: {
        prependData: '@import "~@/global.scss";',
      },
    },
  },
};
