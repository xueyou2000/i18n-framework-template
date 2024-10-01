import { defineConfig, mergeRsbuildConfig } from '@rsbuild/core'
import baseConfig from './rsbuild.base.config'

const config = defineConfig({
  server: {
    port: 8080,
    // TODO: 国际化不同国家药自定义不同fallback路径
    htmlFallback: 'index'
  }
})
// console.log('>>>', process.env)

export default mergeRsbuildConfig(baseConfig, config)
