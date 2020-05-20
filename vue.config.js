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
  publicPath: process.env.NODE_ENV === 'production'
    ? 'lufs.afroghyar.com/'
    : '/'
}
