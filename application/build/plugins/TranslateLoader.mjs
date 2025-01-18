import xxhash from 'xxhash-wasm'

const { h32ToString } = await xxhash()

// 匹配 [ 't("abc")', 't("123")' ] 翻译函数调用.  '' | '' | `` 字符串都能匹配
const matchTranslateReg =
  /(intl[\s]*.[\s]*t[\s]*\([\s]*['][\s]*[\S\s]*?[\s]*[']\s*[\s),])|(intl[\s]*.[\s]*t[\s]*\([\s]*["][\s]*[\S\s]*?[\s]*["]\s*[\s),])|(intl[\s]*.[\s]*t[\s]*\([\s]*[`][\s]*[\S\s]*?[\s]*[`]\s*[\s),])/g

// 匹配内容 [ 'abc', '123' ]
const transKeyReg =
  /((?<=intl[\s]*.[\s]*t[\s]*\([\s]*['][\s]*)[\S\s]*?([\s]*)(?=[']\s*[\s),])|(?<=intl[\s]*.[\s]*t[\s]*\([\s]*["][\s]*)[\S\s]*?([\s]*)(?=["]\s*[\s),])|(?<=intl[\s]*.[\s]*t[\s]*\([\s]*[`][\s]*)[\S\s]*?([\s]*)(?=[`]\s*[\s),]))/g

export default function loader(content) {
  return content.replace(matchTranslateReg, (match) => {
    return match.replace(transKeyReg, (transKey) => {
      return h32ToString(transKey)
    })
  })
}
