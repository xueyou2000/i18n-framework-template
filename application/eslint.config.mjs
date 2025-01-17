import { defineFlatConfig } from 'eslint-define-config'
import { defaultESLint } from '@framework/lint-set'

// ESLint9开始，改变了默认查找方式，在 package.json 中指定了 eslintConfig 没用
export default defineFlatConfig([...defaultESLint])
