// env.d.ts
import 'node'

declare namespace NodeJS {
  interface ProcessEnv {
    /** 启动的local字符串(多local空格逗号分隔), jp, zh-cn */
    locals?: string
  }
}
