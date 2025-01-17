import { defineConfig, mergeRsbuildConfig } from '@rsbuild/core'
import baseConfig from './rsbuild.base.config'

const config = defineConfig({
  dev: {
    // lazyCompilation开启后, 会造成使用tauri时, 不会自动渲染，除非手动在浏览器访问一次
    lazyCompilation: false
  },
  server: {
    host: '0.0.0.0',
    port: process.env.PORT ? Number(process.env.PORT) : 8080,
    historyApiFallback: {
      verbose: false,
      rewrites: [
        {
          from: /^\/[a-z]+(-[a-z]+)?\//,
          to: (context) => {
            return `${context.match[0]}/index.html`
          }
        }
      ]
    }
  }
})

export default mergeRsbuildConfig(baseConfig, config)
