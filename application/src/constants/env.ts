/// <reference types="@rsbuild/core/types" />

/**
 * 是否开发模式
 */
export const isDevMode = import.meta.env.MODE === 'development'

/**
 * 是否是客户端模式
 */
export const hasWindowMode = typeof window !== 'undefined'

/**
 * 路径前缀
 */
export const assetPrefix = process.env.CLIENT_ASSET_PREFIX || '/'

/**
 * 版本时间戳
 */
export const VERSION = process.env.VERSION || ''
