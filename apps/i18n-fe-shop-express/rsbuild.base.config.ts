import { defineConfig, mergeRsbuildConfig } from '@rsbuild/core'
import baseConfig from '@framework/build/rsbuild-base-config'

function getClientEnv() {
  const define = {}

  for (const key in process.env) {
    if (key.startsWith('CLIENT_')) {
      define[`process.env.${key}`] = JSON.stringify(process.env[key])
    }
  }
  return define
}

const config = defineConfig({
  source: {
    // entries: {
    //   index: './src/index.ts',
    // },
    alias: {
      '@': './src'
    },
    define: getClientEnv()
  }
})

export default mergeRsbuildConfig(baseConfig, config)
