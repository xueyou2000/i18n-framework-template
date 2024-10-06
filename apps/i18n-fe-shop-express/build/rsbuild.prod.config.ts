import { defineConfig, mergeRsbuildConfig } from '@rsbuild/core'
import { RsdoctorRspackPlugin } from '@rsdoctor/rspack-plugin'

import baseConfig from './rsbuild.base.config'

const config = defineConfig({
  environments: {
    web: {
      source: {
        // react-router路由相关包现在都是es6语法，为了兼容性需要转换
        include: [/[\\/]node_modules[\\/](react-router|react-router-dom|@remix-run[\\/]router)/]
      },
      output: {
        // assetPrefix: 'https://cdn.example.com/assets/'
        assetPrefix: process.env.CLIENT_ASSET_PREFIX || '/',
        distPath: {
          js: 'static/js/[runtime]'
        },
        // polyfill: 'usage',
        legalComments: 'none',

        manifest: true
        // externals: {
        //   react: 'React',
        //   'react-dom': 'ReactDOM'
        // }
      },
      tools: {
        rspack(_, { appendPlugins }) {
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

  // html: {
  //   tags: [
  //     {
  //       tag: 'script',
  //       publicPath: false,
  //       append: false,
  //       attrs: { src: 'https://unpkg.com/react@18.3.1/umd/react.production.min.js' }
  //     },
  //     {
  //       tag: 'script',
  //       publicPath: false,
  //       append: false,
  //       attrs: { src: 'https://unpkg.com/react-dom@18.3.1/umd/react-dom.production.min.js' }
  //     }
  //   ]
  // }
})
// console.log('>>>', process.env)

export default mergeRsbuildConfig(baseConfig, config)
