import { defineConfig } from '@rslib/core'
import { pluginReact } from '@rsbuild/plugin-react'
import { pluginSass } from '@rsbuild/plugin-sass'

export default defineConfig({
  source: {
    entry: {
      index: ['./src/**']
    }
  },
  lib: [
    {
      bundle: false,
      dts: true,
      format: 'esm',
      output: {
        distPath: {
          root: './dist/esm'
        }
      }
    },
    {
      bundle: false,
      dts: true,
      format: 'cjs',
      output: {
        distPath: {
          root: './dist/cjs'
        }
      }
    }
    // {
    //   bundle: false,
    //   dts: true,
    //   format: 'umd',
    //   umdName: 'ReactUtils',
    //   output: {
    //     distPath: {
    //       root: './dist/umd'
    //     }
    //   }
    // }
  ],
  output: {
    target: 'web'
  },
  plugins: [pluginReact(), pluginSass()]
})
