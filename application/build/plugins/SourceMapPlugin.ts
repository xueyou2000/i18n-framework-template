import type { RsbuildPlugin } from '@rsbuild/core'
import { consola } from 'consola'
import { access, constants, mkdir, readFile, rename, rm, writeFile } from 'node:fs/promises'
import { dirname, join, normalize, relative, resolve } from 'node:path'
import { glob } from 'fast-glob'

import { ManifestJson } from '../ssr/types'
import { readFileJson } from '../utils'

export type SourceMapOptions = {
  sourceMapDist?: string
}

/**
 * sourcemap插件
 * todo: 后续集成sourcemap到服务器上传, 思考 assetPrefix 如果为 https://cnd 路径时如何处理
 * @description 为web环境开启sourcemap配置, 并将sourcemap输出到指定目录
 */
export const pluginSourceMap = (options: SourceMapOptions = {}): RsbuildPlugin => ({
  name: 'xueyou:sourcemap-plugin',
  setup(api) {
    // 确保开启sourcemap, manifest
    api.modifyEnvironmentConfig((config, { name, mergeEnvironmentConfig }) => {
      if (name !== 'web') {
        return config
      }
      return mergeEnvironmentConfig(config, {
        output: {
          sourceMap: true,
          manifest: config?.output?.manifest || true
        }
      })
    })

    api.onAfterBuild(async () => {
      const config = api.getNormalizedConfig({ environment: 'web' })
      if (!config.output.manifest) {
        consola.warn('manifest is disabled, sourcemap plugin will not work.')
        return
      }
      const distPath = normalize(api.context.distPath)
      const manifest = config.output.manifest
      const manifestName = typeof manifest === 'string' ? manifest : 'manifest.json'

      const json = await readFileJson<ManifestJson>(join(distPath, manifestName))
      const allFiles = json?.allFiles || []

      // 默认目标路径
      const sourceMapDist = options.sourceMapDist ? resolve(options.sourceMapDist) : distPath

      const assetPrefix = config.output.assetPrefix || '/'

      // 移除所有目录中的 service-worker map
      const workerMaps = await glob(join(distPath, '**/service-worker.js.map'))
      for (const workerMap of workerMaps) {
        try {
          await access(workerMap, constants.F_OK)
          await rm(workerMap)
        } catch {
          console.log(`${workerMap} not found`)
        }
      }

      // 处理 .map 文件
      for (const fileRelativePath of allFiles) {
        if (fileRelativePath.endsWith('.map')) {
          const file = fileRelativePath.replace(assetPrefix, '/')

          // 获取原始文件名
          const originalFile = file.replace('.map', '')

          // 原始文件路径
          const originalFilePath = join(distPath, originalFile)
          // 修改后的map文件路径
          const sourceMapPath = join(sourceMapDist, file)

          // 移动 .map 文件到目标目录
          await mkdir(dirname(sourceMapPath), { recursive: true })
          await rename(join(distPath, file), sourceMapPath)

          // 修改原始文件内容
          const originalContent = await readFile(originalFilePath, 'utf-8')
          // //# sourceMappingURL=index.f79148e7.js.map => //# sourceMappingURL=/sourceMapDist/index.f79148e7.js.map
          const updatedContent = originalContent.replace(
            /# sourceMappingURL=.+\.map/,
            `# sourceMappingURL=${relative(dirname(originalFilePath), sourceMapPath)}`
          )

          // 保存修改后的原始文件
          await writeFile(originalFilePath, updatedContent, 'utf-8')
        }
      }
    })
  }
})
