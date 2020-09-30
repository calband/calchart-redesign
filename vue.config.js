module.exports = {
  configureWebpack: {
    devtool: 'source-map'
  },
  lintOnSave: false,
  publicPath: '',
  outputDir: 'calchart',
  css: {
    loaderOptions: {
      scss: {
        prependData: '@import "~@/global.scss";'
      }
    }
  }
}
