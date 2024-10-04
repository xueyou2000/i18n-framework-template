/**
 * 是否开发模式
 */
export const isDevMode = import.meta.env.MODE === 'development'

/**
 * 是否服务端dev渲染
 */
export const isSsrDevMode = !!import.meta.env.CLIENT_SSR
