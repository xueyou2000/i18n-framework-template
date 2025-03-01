import { BaseConfig } from '@framework/build'
import { defineConfig, mergeRsbuildConfig } from '@rsbuild/core'
import { consola } from 'consola'

import { BUILD_MANIFEST_NAME, CLIENT_ASSET_PREFIX, DEFAULT_HTML, MANIFEST_NAME, SSR_RENDER_FILE, VERSION } from './constants'
import { getEntries, localInfoArray, localInfoMap } from './utils'

const config = defineConfig({
  environments: {
    web: {
      source: {
        entry: getEntries(localInfoMap),
        define: {
          'process.env.VERSION': JSON.stringify(`${VERSION}`)
        }
      },
      output: {
        target: 'web',
        manifest: BUILD_MANIFEST_NAME,
        copy: [
          ...localInfoArray.map((localInfo) => {
            const { local, manifest } = localInfo

            return {
              from: manifest,
              to: () => {
                return `${local}/${MANIFEST_NAME}`
              },
              transform: (input: Buffer) => {
                const content = input.toString()
                // 改写 路径
                return content.replace(/{BASE_URL}/g, CLIENT_ASSET_PREFIX)
              }
            }
          })
        ]
      },
      html: {
        outputStructure: 'nested',
        templateParameters: {
          MANIFEST_NAME,
          CLIENT_ASSET_PREFIX
        },
        template({ entryName }) {
          const htmlTemplate = localInfoMap.get(entryName)?.htmlTemplate
          if (!htmlTemplate) {
            consola.error(new Error(`入口HTML没有配置: ${entryName}`))
          }
          return htmlTemplate
        },
        title() {
          return process.env.TITLE || ''
        },
        tags: [
          (tags, context) => {
            return [
              {
                tag: 'link',
                publicPath: false,
                append: false,
                attrs: {
                  ref: 'manifest',
                  href: `${CLIENT_ASSET_PREFIX}${context.entryName}/${MANIFEST_NAME}`
                }
              },
              ...tags
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
        template: DEFAULT_HTML
      }
    }
  },
  source: {
    alias: {
      '@': './src'
    }
  },
  tools: {
    rspack: {
      module: {
        rules: [
          {
            // 这种方式没法更好的兼容服务端渲染, 所以放弃
            test: /\.(?:js|jsx|mjs|cjs|ts|tsx|mts|cts)$/,
            type: 'javascript/auto',
            include: [/src/],
            use: [
              {
                loader: require.resolve('./plugins/TranslateLoader.mjs')
              }
            ]
          }
        ]
      }
    }
  }
})

export default mergeRsbuildConfig(BaseConfig, config)
