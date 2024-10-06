/**
 * 是否开发模式
 */
export const isDevMode = import.meta.env.MODE === 'development'

/**
 * 路径前缀
 */
export const assetPrefix = process.env.CLIENT_ASSET_PREFIX || '/'
