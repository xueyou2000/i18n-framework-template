/**
 * 获取命令行参数值
 * @param option 例如: --locals=in,jp   获取值不包含key
 * @param prefix 前缀，默认空，一般是 - 或 --
 */
export function getArgv(option: string, prefix = '') {
  const args = process.argv.slice(2)
  // const prefix = option.startsWith('-') ? '' : '--'
  return args.find((arg) => arg.startsWith(`${prefix}${option}=`))?.replace(`${prefix}${option}=`, '')
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
