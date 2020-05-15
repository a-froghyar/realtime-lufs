module.exports = {
  transpileDependencies: ["vuetify"],
  // https://github.com/webpack-contrib/worker-loader/issues/177
  parallel: false,
  chainWebpack: (config) => {
    config.module.rule('worker')
      .test(/\.worker\.js$/i)
      .use('worker-loader')
      .loader('worker-loader')
  },
}
