import { defineConfig, mergeRsbuildConfig } from '@rsbuild/core'
import baseConfig from './rsbuild.base.config'

const config = defineConfig({
  output: {
    // assetPrefix: 'https://cdn.example.com/assets/'
  }
})
// console.log('>>>', process.env)

export default mergeRsbuildConfig(baseConfig, config)
