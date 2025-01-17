import type { Preview } from '@storybook/react'

// 由于Button组件中使用了application项目的主题, 所以为了预览时样式一致, 这里临时引入application的主题
// 由于storybook不能够直接访问application项目的样式文件, 所以拷贝了一份
import '../styles/reset.scss'
import '../styles/index.scss'

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i
      }
    }
  }
}

export default preview
