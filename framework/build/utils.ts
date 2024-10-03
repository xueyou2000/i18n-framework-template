/**
 * 获取命令行参数值
 * @param option 例如: --locals=in,jp   获取值不包含key
 */
export function getArgv(option: string) {
  const args = process.argv.slice(2)
  const prefix = option.startsWith('-') ? '' : '--'
  return args
    .find((arg) => arg.startsWith(`${prefix}${option}=`))
    ?.replace(`${prefix}${option}=`, '')
}

/**
 * 解析国家数组
 * @param localStr 本地配置字符串,  例如: "in,jp,kh,kh-en"
 */
export function parseLocals(localStr?: string) {
  if (!localStr) return []
  return localStr.split(',').map((item) => item.trim())
}

/**
 * 获取环境变量配置
 * @description CLIENT_开头的环境变量将被用户客户端中，而不止是nodejs环境
 *
 * process.env.xxx 访问环境变量
 */
export function getClientEnvDefine() {
  const define: Record<string, string> = {}
  for (const key in process.env) {
    if (key.startsWith('CLIENT_')) {
      define[`process.env.${key}`] = JSON.stringify(process.env[key] || '')
    }
  }
  return define
}
