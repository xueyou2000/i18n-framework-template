/// <reference lib="webworker" />
import { CacheableResponsePlugin } from 'workbox-cacheable-response'
import { clientsClaim, setCacheNameDetails } from 'workbox-core'
import { ExpirationPlugin } from 'workbox-expiration'
import { precacheAndRoute } from 'workbox-precaching'
import { registerRoute, setDefaultHandler } from 'workbox-routing'
import { CacheFirst, NetworkFirst, NetworkOnly, StaleWhileRevalidate } from 'workbox-strategies'

// const self: ServiceWorkerGlobalScope = globalThis as unknown as ServiceWorkerGlobalScope

declare let self: ServiceWorkerGlobalScope

export function initServiceWorker(
  cacheApiUrls: string[],
  options?: { disableDefaultHandler: boolean }
) {
  // 如果有新版，则立即安装并且激活
  self.skipWaiting()

  clientsClaim()

  /**
   * 【生命周期】新版本激活
   */
  self.addEventListener('activate', (event) => {
    // console.debug('[Service Worker] Activate')

    /**
     * （本地调试除外）
     * 每次有新版本安装，就执行以下处理：
     * 删除 web-runtime 缓存中，路径不包含当前版本号的 chunk 文件
     */
    // event.waitUntil(caches.delete('web-runtime'))
    event.waitUntil(
      caches.open('web-runtime').then(async (cache) => {
        // 取出缓存中的所有数据
        const cacheData = await cache.keys()

        console.log('>>> cacheData', cacheData)

        // 过滤数据中不包含当前版本号路径的文件
        const otherVersionFiles = cacheData.filter((cacheItem) => {
          // cnd缓存不清除
          if (cacheItem.url.includes('unpkg.com')) {
            return false
          }
          return !cacheItem.url.includes(`/${process.env.VERSION}/`)
        })

        console.log('>>> activate: 清除历史缓存', otherVersionFiles)

        // 删除满足条件的文件
        return Promise.all(otherVersionFiles.map((cacheName) => cache.delete(cacheName)))
      })
    )
  })

  /**
   * 设置缓存细节
   * 根据官方文档的描述，只对 precache 和 runtime 有效
   */
  setCacheNameDetails({
    prefix: 'web', // 缓存名称的前缀
    suffix: '', // 缓存名称的后缀
    precache: 'precache', // 预缓存的资源使用的名称（会提前下载资源）
    runtime: 'runtime' // 运行时缓存的资源使用的缓存名称
  })

  /**
   * 预缓存列表（ __WB_MANIFEST 由 workbox 在 webpack 打包阶段生成 ）
   */
  let cacheFiles = self.__WB_MANIFEST || []
  // 过滤html文件, 仅为了本地调试
  cacheFiles = cacheFiles.filter((file) => {
    if (typeof file === 'string') {
      return !file.endsWith('.html')
    } else {
      return !file?.url?.endsWith('.html')
    }
  })
  precacheAndRoute(cacheFiles, {
    ignoreURLParametersMatching: [/.*/], // 忽略所有 URL 参数。这意味着无论 URL 中包含什么参数，都会匹配到缓存中的资源
    cleanURLs: false // 通常用于去除 URL 中的查询参数，但这在这里没有启用
  })

  if (!options?.disableDefaultHandler) {
    setDefaultHandler(new NetworkOnly())
  }

  /**
   * ===============================
   * 【离线页面配置】
   * ===============================
   */
  // setCatchHandler(async (options) => {
  //   const dest = options.request.destination
  //   const cache = await self.caches.open('web-precache')

  //   if (dest === 'document') {
  //     return (await cache.match(fallbackPageUrl)) || Response.error()
  //   }

  //   return Response.error()
  // })

  /**
   * 缓存访问过的网页
   * @description 对所有navigate导航请求配置NetworkFirst缓存策略
   */
  registerRoute(
    ({ request }) => {
      return request.mode === 'navigate'
    },
    new NetworkFirst({
      networkTimeoutSeconds: 5, // 超时时间5秒
      cacheName: 'web-pages',
      plugins: [
        /** 只有状态码为0或200的响应才会被缓存 */
        new CacheableResponsePlugin({
          statuses: [0, 200]
        })
      ]
    })
  )

  /**
   * 缓存 WebFonts 样式文件
   * @description 对谷歌字体和iconfont文件缓存， 本地缓存优先，同时拉取远程资源进行替换
   * @see https://developers.google.com/web/tools/workbox/modules/workbox-recipes#google_fonts_cache
   */
  registerRoute(
    ({ request, url }) => {
      // Google Fonts 样式文件
      const googleFonts = url.origin === 'https://fonts.googleapis.com'

      // 字体图标文件
      const iconFonts =
        request.destination === 'style' && (url.pathname || '').includes('/iconfont/')
      return googleFonts || iconFonts
    },
    // StaleWhileRevalidate策略: 从缓存中返回资源，同时发起网络请求更新缓存
    new StaleWhileRevalidate({
      cacheName: 'web-fonts-stylesheets',
      plugins: [
        new CacheableResponsePlugin({
          statuses: [0, 200]
        })
      ]
    })
  )

  /**
   * 缓存外部资源文件
   * @description 缓存优先，有缓存则不重新拉取资源文件，缓存 10 个文件
   */
  registerRoute(
    ({ request, url }) => {
      // 第三方静态资源
      const thirdParty =
        request.destination === 'script' &&
        ['www.googleadservices.com', 'connect.facebook.net', 'cdn.polyfill.io'].includes(
          url.hostname || ''
        )

      // 非图片的 web file 文件
      const otherFiles =
        request.destination !== 'image' && (url.hostname || '').includes('cnd.images.com')
      return thirdParty || otherFiles
    },
    new CacheFirst({
      cacheName: 'web-resources',
      plugins: [
        new CacheableResponsePlugin({
          statuses: [0, 200]
        }),
        new ExpirationPlugin({
          maxAgeSeconds: 60 * 60 * 24 * 90, // 缓存期限为 90 天
          maxEntries: 20 // 最高缓存 20 个文件
        })
      ]
    })
  )

  /**
   * 缓存浏览过的图片
   * @description 本地缓存优先
   * @see https://developers.google.com/web/tools/workbox/modules/workbox-recipes#image_cache
   */
  registerRoute(
    ({ request, url }) => {
      const hostname = url.hostname || ''
      const imgsFile = hostname.includes('cnd.images.com')
      return request.destination === 'image' && imgsFile
    },
    new CacheFirst({
      cacheName: 'web-images',
      plugins: [
        new CacheableResponsePlugin({
          statuses: [0, 200]
        }),
        new ExpirationPlugin({
          maxAgeSeconds: 60 * 60 * 24 * 7, // 缓存 7 天
          maxEntries: 100 // 最高缓存 100 个文件
        })
      ]
    })
  )

  /**
   * 缓存浏览过页面的 Chunk 资源
   * @description 本地缓存优先，同时拉取远程资源进行替换
   */
  registerRoute(
    ({ request, url }) => {
      const isCssOrJs = ['style', 'script'].includes(request.destination)
      return (
        isCssOrJs &&
        ((url.pathname || '').includes('chunk') ||
          (url.pathname || '').includes('static') ||
          (url.pathname || '').includes('min.js'))
      )
    },
    new StaleWhileRevalidate({
      cacheName: 'web-runtime',
      plugins: [
        new CacheableResponsePlugin({
          statuses: [0, 200]
        })
      ]
    })
  )

  /**
   * 缓存浏览过的接口【安全起见只缓存 GET 请求，且路径中必须带有 cacheable=1 参数】
   * @description 网络请求优先，如果失败才启用本地缓存数据
   */
  registerRoute(
    ({ url }) =>
      cacheApiUrls.some((el) => url.href.includes(el)) && url.searchParams.get('cacheable') === '1',
    new NetworkFirst({
      cacheName: 'web-api-data',
      plugins: [
        new CacheableResponsePlugin({
          statuses: [0, 200]
        }),
        new ExpirationPlugin({
          maxEntries: 100, // 最高缓存 100 个返回值
          maxAgeSeconds: 60 * 60 * 24 * 3 // 缓存 3 天
        })
      ]
    }),
    'GET'
  )

  /**
   * 缓存翻译文件
   * @description 本地缓存优先，同时拉取远程最新翻译进行替换
   */
  registerRoute(
    ({ url }) => url.pathname.includes('translate-language'),
    new StaleWhileRevalidate({
      cacheName: 'web-translation',
      plugins: [
        new CacheableResponsePlugin({
          statuses: [0, 200]
        }),
        new ExpirationPlugin({
          maxAgeSeconds: 60 * 60 * 24 * 30 // 缓存 30 天
        })
      ]
    })
  )
}
