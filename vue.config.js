module.exports = {
  lintOnSave: process.env.NODE_ENV !== 'production',
  publicPath: '',
  css: {
    loaderOptions: {
      scss: {
        prependData: '@import "~@/global.scss";',
      },
    },
  },
};
