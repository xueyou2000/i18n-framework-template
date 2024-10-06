/**
 * 从url获取lang
 */
export const getCurrentLanguage = (pathname?: string, assetPrefix = '/') => {
  let path = pathname || window.location.pathname

  const regex = new RegExp('^' + assetPrefix)
  path = '/' + path.replace(regex, '')

  const language = path.split('/')[1]
  return language
}
