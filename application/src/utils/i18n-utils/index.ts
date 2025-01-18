import i18next, { InitOptions, Resource } from 'i18next'
import ChainedBackend from 'i18next-chained-backend'
// import HttpBackend from 'i18next-http-backend'
import ICU from 'i18next-icu'
import resourcesToBackend from 'i18next-resources-to-backend'
import { initReactI18next } from 'react-i18next'

const FALLBACK_LANG = 'en-US'

/**
 * 初始化i18n
 * @param local 站点(国家-语言)
 * @param lang 默认语言
 * @param resources 本地翻译资源
 * @param callback 回调
 */
export function initI18nClient(locale: string, lang: string, resources: Resource, callback?: () => void) {
  /**
   * 初始化
   */
  i18next
    .use(ICU)
    .use(ChainedBackend)
    .use(initReactI18next)
    .init(
      {
        // 遵循 IETF BCP 47 标准
        lng: lang,
        resources,
        fallbackLng: FALLBACK_LANG, // 使用当前站点默认语言包作为 fallback 取值
        load: 'currentOnly', // 禁止加载根语言包，en-US 不会额外加载 en.json
        // debug      : true, // 调试模式
        backend: {
          backends: [
            // HttpBackend, // primary: 调用接口获取最新翻译
            resourcesToBackend(resources) // fallback: 读取本地翻译文件
          ],
          backendOptions: [
            {
              loadPath: 'https://www.cdn.com/translate-language/i18n-fe_{{lng}}.json',
              parse: (data: string) => Object.assign({}, resources[lang].translation, JSON.parse(data || '{}')),
              requestOptions: {
                cache: 'no-store'
              }
            }
          ]
        }
      },
      () => {
        if (typeof callback === 'function') callback()
      }
    )

  /**
   * 页面初始化语言后，根据当前语言的特点，进行样式处理
   */
  i18next.on('initialized', function (options: InitOptions) {
    changeHtmlAttr(options.lng || 'en-US')

    console.log('>>> i18next.on initialized', i18next.t('hello'))
  })

  /**
   * 用户切换语言包后，根据当前语言的特点，进行样式处理
   */
  i18next.on('languageChanged', function (lang: string) {
    changeHtmlAttr(lang)
  })

  function changeHtmlAttr(lang: string): void {
    const htmlElement = document && document.documentElement
    if (htmlElement) {
      // 设置页面语言
      htmlElement.setAttribute('xml:lang', lang)
      htmlElement.setAttribute('lang', lang)

      // 设置书写方式
      htmlElement.setAttribute('dir', i18next.dir(lang))
    }
  }

  return i18next
}

/**
 * 初始化i18n，用于服务端
 */
export async function initI18nSSR(lang: string, resources: Resource) {
  const i18next = await import('i18next')
  const i18nextICU = await import('i18next-icu')

  i18next.use(i18nextICU.default).use(initReactI18next).init({
    lng: lang,
    fallbackLng: FALLBACK_LANG, // 使用当前站点默认语言包作为 fallback 取值
    load: 'currentOnly', // 禁止加载根语言包，en-US 不会额外加载 en.json
    resources // 直接读取本地静态翻译资源进行 HTML 文件的渲染
  })
}

/**
 * 从url获取lang
 */
export const getCurrentLanguage = (pathname?: string, assetPrefix = '/') => {
  let path = pathname || window.location.pathname

  const regex = new RegExp('^' + assetPrefix)
  path = '/' + path.replace(regex, '')

  const language = path.split('/')[1]
  return language
}
