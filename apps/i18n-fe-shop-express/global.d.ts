// env.d.ts
import 'node'

declare namespace NodeJS {
  interface ProcessEnv {
    /** 启动的国家字符串, kh,kh-en,in,jp */
    locals?: string
  }
}

// eslint-disable-next-line no-var
declare var self: ServiceWorkerGlobalScope
