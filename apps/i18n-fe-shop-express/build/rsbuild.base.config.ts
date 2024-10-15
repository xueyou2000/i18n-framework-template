import { defineConfig, mergeRsbuildConfig } from '@rsbuild/core'
import { BaseConfig } from '@framework/build'
import { consola } from 'consola'

const { npm_package_version } = process.env

import { getLocalsInfo, getEntries, SSR_RENDER_FILE, getLocals, MANIFEST_NAME } from './utils'

const localInfo = getLocalsInfo()

const config = defineConfig({
  environments: {
    web: {
      source: {
        entry: getEntries(localInfo),
        define: {
          'process.env.VERSION': `${npm_package_version}@${Date.now()}`
        }
      },
      output: {
        target: 'web',
        copy: [
          ...getLocals(localInfo).map((local) => {
            const manifestFile = localInfo.get(local)?.manifest || ''
            return {
              from: manifestFile,
              to: () => {
                return `${local}/${MANIFEST_NAME}`
              },
              transform: (input) => {
                const content = input.toString()
                const json = JSON.parse(content)
                // 改写 manifest start_url
                json.start_url = `/${local}/`
                return JSON.stringify(json)
              }
            }
          })
        ]
      },
      html: {
        outputStructure: 'nested',
        template({ entryName }) {
          const htmlTemplate = localInfo.get(entryName)?.htmlTemplate
          if (!htmlTemplate) {
            consola.error(new Error(`入口HTML没有配置: ${entryName}`))
          }
          return htmlTemplate
        },
        title() {
          // TODO: 最终理想状态下，应该是由管理系统中配置seo信息，然后运行build时将此信息替换
          // TODO: 备选方案是将一个作为专门的国家配置文件，里面有货币格式，日期格式，标题等信息
          return process.env.TITLE || ''
        },
        tags: [
          (tags, context) => {
            return [
              ...tags,
              {
                tag: 'link',
                publicPath: false,
                append: false,
                attrs: {
                  href: `/${context.entryName}/${MANIFEST_NAME}`,
                  ref: 'manifest'
                }
              }
            ]
          }
        ]
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
