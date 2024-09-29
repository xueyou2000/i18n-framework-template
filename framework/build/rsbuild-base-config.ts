import { defineConfig } from '@rsbuild/core'
import { pluginReact } from '@rsbuild/plugin-react'
import { pluginSass } from '@rsbuild/plugin-sass'
import { pluginTypeCheck } from '@rsbuild/plugin-type-check'

export default defineConfig({
  plugins: [pluginTypeCheck(), pluginReact(), pluginSass()]
})
