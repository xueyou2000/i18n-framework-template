import { defineConfig, mergeRsbuildConfig } from '@rsbuild/core'
import { BaseConfig } from '@framework/build'
import signale from 'signale'

import { getLocalsInfo, getEntries, SSR_RENDER_FILE } from './utils'

const localInfo = getLocalsInfo()

const config = defineConfig({
  environments: {
    web: {
      source: {
        entry: getEntries(localInfo)
      },
      output: {
        target: 'web'
      },
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
      }
    },
    ssr: {
      source: {
        entry: {
          index: SSR_RENDER_FILE
        }
      },
      output: {
        target: 'node',
        distPath: {
          root: 'dist/server'
        }
      },
      html: {
        template: '../src/locals/index.html'
      }
    }
  },
  source: {
    alias: {
      '@': './src'
    }
  }
})

export default mergeRsbuildConfig(BaseConfig, config)
