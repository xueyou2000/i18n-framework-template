import { defineConfig, mergeRsbuildConfig } from '@rsbuild/core'
import { RsdoctorRspackPlugin } from '@rsdoctor/rspack-plugin'

import baseConfig from './rsbuild.base.config'

const config = defineConfig({
  output: {
    distPath: {
      js: 'static/js/[runtime]'
    },
    legalComments: 'none',
    // assetPrefix: 'https://cdn.example.com/assets/'
    manifest: true,
    overrideBrowserslist: ['iOS >= 9', 'Android >= 4.4', 'last 2 versions', '> 0.2%', 'not dead']
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
