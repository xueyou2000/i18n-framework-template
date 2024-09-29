/* eslint-disable no-undef */
/* eslint-env node */

// Tips: 以下环境变量默认都在nodejs中可用，如果想在客户端中访问，请使用CLIENT_开头

function base() {
  return {
    TITLE: 'title',
    CLIENT_ENV: '环境变量test'
  }
}

module.exports = {
  dev: Object.assign(base(), {
    // 端口
    PORT: process.env.PORT || 3000,
    // 输出路径
    OUT_DIR: 'dist-dev'
  }),
  prod: Object.assign(base(), {
    // 输出路径
    OUT_DIR: 'dist-prod'
  })
}
