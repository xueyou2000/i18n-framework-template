/// <reference lib="webworker" />

import { CacheableResponsePlugin } from 'workbox-cacheable-response'
import { clientsClaim, setCacheNameDetails } from 'workbox-core'
import { ExpirationPlugin } from 'workbox-expiration'
import { precacheAndRoute } from 'workbox-precaching'
import { registerRoute, setDefaultHandler } from 'workbox-routing'
import { CacheFirst, NetworkFirst, NetworkOnly, StaleWhileRevalidate } from 'workbox-strategies'

const self: ServiceWorkerGlobalScope = globalThis as unknown as ServiceWorkerGlobalScope

export function initServiceWorker(
  local: string,
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

        // 过滤数据中不包含当前版本号路径的文件
        const otherVersionFiles = cacheData.filter(
          (cacheItem) => !cacheItem.url.includes(`/${process.env.VERSION}/`)
        )

        // 删除满足条件的文件
        return Promise.all(otherVersionFiles.map((cacheName) => cache.delete(cacheName)))
      })
    )
  })

  /**
   * 设定 cache name
   * 根据官方文档的描述，只对 precache 和 runtime 有效
   */
  setCacheNameDetails({
    prefix: 'web',
    suffix: '',
    precache: 'precache', // 预缓存的资源（会提前下载资源）
    runtime: 'runtime' // 动态缓存的资源（本质上该配置无用）
  })

  /**
   * 预缓存列表（ __WB_MANIFEST 由 workbox 在 webpack 打包阶段生成 ）
   */
  precacheAndRoute(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ((self as any).__WB_MANIFEST || []).concat([]),
    {
      ignoreURLParametersMatching: [/.*/], // Ignore all URL parameters.
      cleanURLs: false
    }
  )

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
   * @description 网络请求优先
   * @kind 当前 www.mi.com 域名存在其他项目，如 product 和 static，因此页面缓存功能暂时不可启用
   */
  registerRoute(
    ({ request }) => {
      return request.mode === 'navigate'
    },
    new NetworkFirst({
      // the service worker should wait for
      // the network response to arrive before it bails out
      // and returns the last cached version of it.
      networkTimeoutSeconds: 5,
      cacheName: 'web-pages',
      plugins: [
        new CacheableResponsePlugin({
          statuses: [0, 200]
        })
      ]
    })
  )

  /**
   * 缓存 WebFonts 样式文件
   * @description 本地缓存优先，同时拉取远程资源进行替换
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
    ({ request, url }) =>
      ['style', 'script'].includes(request.destination) && (url.pathname || '').includes('chunk'),
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
