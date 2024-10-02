import { defineConfig, mergeRsbuildConfig } from '@rsbuild/core'
import { BaseConfig } from '@framework/build'
import signale from 'signale'

import { getLocalsInfo, getEntries } from './utils'
import { i18nOutputPlugin } from './plugins'

const localInfo = getLocalsInfo()

const config = defineConfig({
  source: {
    entry: getEntries(localInfo),
    alias: {
      '@': './src'
    }
  },
  // tools: {
  //   rspack: {
  //     output: {
  //       filename(pathData, assetInfo) {
  //         console.log('>>> pathData', pathData)
  //         console.log('>>> assetInfo', assetInfo)
  //         return 'js/[name].[contenthash:8].js'
  //       }
  //     }
  //   }
  // },
  // output: {
  //   // filename: {
  //   //   // js: (pathData) => {
  //   //   //   console.log('>>> pathData', pathData)
  //   //   //   const name = pathData.chunk?.name || ''
  //   //   //   return `${name}/js/[name].[contenthash:8].[ext]`
  //   //   // },
  //   //   js: '[name]/js/[name].[contenthash:8].js'
  //   // },
  //   filename: {
  //     js: '[name]/js/[name].[contenthash:8].js',
  //     css: '[name]/css/[name].[hash:8].css'
  //   },
  //   distPath: {
  //     js: 'locals',
  //     html: 'locals',
  //     css: 'locals'
  //   }
  // },
  html: {
    outputStructure: 'nested',
    template({ entryName }) {
      const htmlTemplate = localInfo.get(entryName)?.htmlTemplate
      if (!htmlTemplate) {
        signale.error(`入口HTML没有配置: ${entryName}`)
      }
      return htmlTemplate
    },
    title() {
      // TODO: 最终理想状态下，应该是由管理系统中配置seo信息，然后运行build时将此信息替换
      // TODO: 备选方案是将一个作为专门的国家配置文件，里面有货币格式，日期格式，标题等信息
      return process.env.TITLE || ''
    }
  },
  plugins: [i18nOutputPlugin()]
})

export default mergeRsbuildConfig(BaseConfig, config)
