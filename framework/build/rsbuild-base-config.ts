import { defineConfig } from '@rsbuild/core'
import { pluginReact } from '@rsbuild/plugin-react'
import { pluginSass } from '@rsbuild/plugin-sass'
import { pluginTypeCheck } from '@rsbuild/plugin-type-check'
import { getClientEnvDefine } from './utils'

export default defineConfig({
  dev: {
    // 与本地开发有关的选项
  },
  html: {
    // 与 HTML 生成有关的选项
  },
  tools: {
    // 与底层工具有关的选项
  },
  output: {
    // 与构建产物有关的选项
  },
  source: {
    // 与源代码解析、编译方式相关的选项
    define: getClientEnvDefine()
  },
  server: {
    // 与 Rsbuild 服务器有关的选项
    // 在本地开发和预览时都会生效
  },
  security: {
    // 与 Web 安全有关的选项
  },
  performance: {
    // 与构建性能、运行时性能有关的选项
  },
  environments: {
    // 为每个环境定义不同的 Rsbuild 配置
  },
  plugins: [pluginTypeCheck({ enable: process.env.TYPE_CHECK === 'true' }), pluginReact(), pluginSass()]
})
