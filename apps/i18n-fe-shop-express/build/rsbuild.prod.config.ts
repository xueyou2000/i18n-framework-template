import { defineConfig, mergeRsbuildConfig } from '@rsbuild/core'
import baseConfig from './rsbuild.base.config'

const config = defineConfig({})
// console.log('>>>', process.env)

export default mergeRsbuildConfig(baseConfig, config)
