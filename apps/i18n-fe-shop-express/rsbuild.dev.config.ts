import { defineConfig, mergeRsbuildConfig } from '@rsbuild/core'
import baseConfig from './rsbuild.base.config'

const config = defineConfig({
  server: {
    port: 8080
  }
})

export default mergeRsbuildConfig(baseConfig, config)
