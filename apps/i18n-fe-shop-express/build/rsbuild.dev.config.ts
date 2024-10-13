import { defineConfig, mergeRsbuildConfig } from '@rsbuild/core'
import baseConfig from './rsbuild.base.config'

const config = defineConfig({
  dev: {
    lazyCompilation: true
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
