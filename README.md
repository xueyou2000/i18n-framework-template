# i18n-framework-template

## 介绍(Introduction)

一个国际化项目模板，基于 React + TypeScript + turbo + rspack 构建。

## 路线图(Roadmap)

- [x] turborepo + pnpm workspace 构建多仓库
- [x] eslint + stylelint + prettierrc + commitlint + husky 单独作为一个基础仓库
- [ ] 响应式布局, 5 个断点， 字体大小自适应，
- [ ] 轻量全局状态管理
- [ ] seo 信息在编译 html 时候注入
- [ ] 版本控制+tag 管理+gitlab 流水线
- [ ] 使用类组件捕获异常
- [ ] pwa, service worker
- [ ] 国际化(语言、金额、日期...) 作为一个单独仓
- [ ] 不同语言入口可能不同
- [ ] 统一日志，consolog工具

## React客户端开发以及服务端渲染方法

服务端渲染：首先，你的React应用需要在服务器上进行渲染，并且将HTML发送到客户端。这通常涉及到使用一个Node.js服务器和一些SSR框架或库，比如Next.js。
客户端水合：当HTML文档到达客户端时，你需要用hydrateRoot来“水合”这个静态HTML，使之变成一个交互式的React应用。在这个过程中，你可以像平常一样使用react-router-dom来设置路由。
配置路由：在你的应用入口文件中，你可以创建一个包含`BrowserRouter`或`StaticRouter`（取决于你是在服务端还是客户端）的React组件树。`BrowserRouter`适用于客户端路由，而`StaticRouter`则用于服务端渲染。

```jsx
import React from 'react'
import { hydrateRoot } from 'react-dom/client'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import App from './App'
import Home from './Home'
import About from './About'

const container = document.getElementById('root')
const root = hydrateRoot(
  container,
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />}>
        <Route index element={<Home />} />
        <Route path="about" element={<About />} />
      </Route>
    </Routes>
  </BrowserRouter>
)
```

## RsBuild 学习记录

### rsbuild-cli

options:

- `-m, --mode <mode>` 指定构建模式，可以是 `development`，`production` 或 `none`
