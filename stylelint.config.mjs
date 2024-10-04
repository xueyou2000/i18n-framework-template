import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { defaultStyleLint } from '@framework/lint-set'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

export default {
  ...defaultStyleLint,
  ignorePath: join(__dirname, './.stylelintignore')
}
