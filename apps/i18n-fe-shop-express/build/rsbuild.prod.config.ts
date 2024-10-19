import { defineConfig, mergeRsbuildConfig } from '@rsbuild/core'
import { RsdoctorRspackPlugin } from '@rsdoctor/rspack-plugin'
import { InjectManifest } from '@aaroon/workbox-rspack-plugin'
import { join } from 'node:path'

import baseConfig from './rsbuild.base.config'

const config = defineConfig({
  environments: {
    web: {
      source: {
        // tips: react-router路由相关包现在都是es6语法，为了兼容性需要转换
        // include: [/[\\/]node_modules[\\/](consola|@remix-run[\\/]router)/]
        // include: [/[\\/]node_modules[\\/](react-router|react-router-dom|@remix-run[\\/]router)/]
      },
      output: {
        // assetPrefix: 'https://cdn.example.com/assets/'
        assetPrefix: process.env.CLIENT_ASSET_PREFIX || '/',
        // distPath: {
        //   js: `static/${VERSION}/js`,
        //   css: `static/${VERSION}/css`
        // },
        // polyfill: 'usage',
        // filename: {
        //   js(pathData) {
        //     if (pathData.runtime && pathData.runtime === pathData.chunk?.name) {
        //       // 入口文件
        //       return `${pathData.runtime}/[name].[contenthash:8].js`
        //     }
        //     return 'static/js/[name].[contenthash:8].js'
        //   }
        // },
        legalComments: 'none',
        manifest: 'rsbuild-manifest.json',
        externals: {
          react: 'React',
          'react-dom': 'ReactDOM'
        }
      },
      html: {
        tags: [
          {
            tag: 'script',
            publicPath: false,
            append: false,
            attrs: {
              src: 'https://unpkg.com/react@18.3.1/umd/react.production.min.js',
              defer: true
            }
          },
          {
            tag: 'script',
            publicPath: false,
            append: false,
            attrs: {
              src: 'https://unpkg.com/react-dom@18.3.1/umd/react-dom.production.min.js',
              defer: true
            }
          }
        ]
      },
      // performance: {
      //   chunkSplit: {
      //     strategy: 'split-by-experience',
      //     override: {
      //       cacheGroups: {
      //         'react-bundle': {
      //           name: 'react-bundle',
      //           chunks: 'all',
      //           test: /node_modules[\\/](react|@remix-run|zustand)/,
      //           priority: 99
      //         }
      //       }
      //     }
      //   }
      // },
      tools: {
        rspack(config, { appendPlugins }) {
          // sw插件
          appendPlugins(
            new InjectManifest({
              swSrc: join(__dirname, '../src/locals/sw.config.ts'),
              swDest: 'service-worker.js' // 默认为 'service-worker.js'
            })
          )
          if (process.env.RSDOCTOR) {
            appendPlugins(
              new RsdoctorRspackPlugin({
                // 插件选项
              })
            )
          }
        }
      }
    }
  }
})
// console.log('>>>', process.env)

export default mergeRsbuildConfig(baseConfig, config)
