/**
 * 从url获取lang
 */
export const getCurrentLanguage = (pathname?: string) => {
  const path = pathname || window.location.pathname
  const language = path.split('/')[1]
  return language
}
