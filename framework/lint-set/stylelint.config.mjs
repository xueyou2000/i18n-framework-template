import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

export default {
  plugins: ['stylelint-prettier'],
  extends: ['stylelint-config-standard-scss', 'stylelint-config-rational-order'],
  rules: {
    'prettier/prettier': true
  },
  ignorePath: join(__dirname, './.stylelintignore')
}
