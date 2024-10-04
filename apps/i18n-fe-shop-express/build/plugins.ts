import { execSync } from 'node:child_process'
import { resolve } from 'path'
import { RsbuildPlugin } from '@rsbuild/core'

export function i18nOutputPlugin(): RsbuildPlugin {
  return {
    name: 'i18nOutputPlugin',
    setup(api) {
      api.onBeforeBuild(() => {
        const scriptPath = resolve(__dirname, './generate-routes.js')
        execSync(`node ${scriptPath}`, { env: { ...process.env } })
      })
      api.modifyRsbuildConfig(() => {
        // options.output
        // if (!options.output) {
        //   options.output = {}
        // }
        // options.output.cssFilename = () => {
        //   return 'locals/[name]/css/[name].[hash:8].css'
        // }
        // console.log(options.entry)
        // options.output.path((info: any) => {
        //   console.log(info)
        //   // info.
        //   // const name = chunk?.name || ''
        //   // return `js/${name}.${contentHash?.slice(0, 8)}.[ext]`
        // })
        // options.output.assetFileNames = 'assets/[name].[hash:8][extname]'
        // options.output.chunkFileNames = 'assets/[name].[hash:8][extname]'
      })
      // api.onBeforeBuild((options) => {
      //   console.log('>>> onBeforeBuild', options.bundlerConfigs.)
      // })
      // api.onAfterCreateCompiler((options) => {
      //   options.compiler.
      //   // api.hooks.done.tap('i18nOutputPlugin',
      // })
    }
  }
}
