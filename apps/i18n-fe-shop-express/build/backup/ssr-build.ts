import { renderHTML } from '../src/locals/ssr'

function registerIgnoreExt() {
  const extensions = ['.css', '.scss', '.less', '.png', '.jpg', '.gif', '.eot']
  for (let i = 0, len = extensions.length; i < len; i++) {
    require.extensions[extensions[i]] = function () {
      return false
    }
  }
}
registerIgnoreExt()

renderHTML({
  url: '/zh-cn/home',
  lang: 'zh-cn'
}).then((result) => console.log('>>> ', result))
