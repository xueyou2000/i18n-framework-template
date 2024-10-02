/**
 * 从url获取lang
 */
export const getCurrentLanguage = () => {
  const path = window.location.pathname
  const language = path.split('/')[1]
  return language
}
