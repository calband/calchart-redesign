module.exports = {
  configureWebpack: {
    devtool: 'source-map',
  },
  lintOnSave: process.env.NODE_ENV !== 'production',
  publicPath: '',
  outputDir: 'calchart',
  css: {
    loaderOptions: {
      scss: {
        prependData: '@import "~@/global.scss";',
      },
    },
  },
};
