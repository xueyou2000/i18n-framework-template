/* eslint-disable no-undef */
/* eslint-env node */

/**
 * 环境变量默认都在nodejs中可用
 * 1. 如果想在客户端中访问，请使用CLIENT_开头
 * 2. 如果值是非简单类型，则需要使用JSON.stringify(xx)转换为json字符串
 */

/**
 * 基础环境配置
 */
function base() {
  return {
    TITLE: 'shop-express',
    CLIENT_ENV: '客户端环境变量',
    CLIENT_ASSET_PREFIX: '/'
  }
}

module.exports = {
  dev: Object.assign(base(), {
    /** 是否ts类型检查(启用会比较耗时) */
    TYPE_CHECK: false
  }),
  prod: Object.assign(base(), {
    // 输出路径
    OUT_DIR: 'dist',
    /** 是否ts类型检查(启用会比较耗时) */
    TYPE_CHECK: false
  }),
  prodPages: Object.assign(base(), {
    // 输出路径
    CLIENT_ASSET_PREFIX: '/i18n-framework-template/'
  })
}
