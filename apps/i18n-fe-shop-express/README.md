# i18n-fe-shop-express

国际化商城前端项目

> 由于github不支持多入口路由回退, 所以访问对应路由(如: /zh-cn/about)是找不到的，必须访问根路径。

[github pages](https://xueyou2000.github.io/i18n-framework-template/zh-cn/)

## 路线图(Roadmap)

- [x] turbo repo + pnpm workspace 构建多仓库
- [x] eslint + stylelint + prettierrc + commitlint + husky 单独作为一个基础仓库
- [x] 不同语言入口可能不同
- [x] seo 信息在编译 html 时候注入
  - [x] 静态seo等信息放置在esbuild.html配置的对应tags里, 推荐在renders/Root.tsx中的Helmet内进行配置
  - [x] 静态信息但不同国家不相同(国家特殊逻辑)，请直接在对应locals/index.html中添加，默认没有此文件，需要请从locals/index.html模板复制一份
  - [ ] 动态seo信息，比如管理系统运营人员配置的不同国家不同路径的seo信息，在ssr编译时传入参数
- [ ] 响应式布局, 5 个断点， 字体大小自适应，
- [ ] 现代化响应式网页开发, 国际化与书写方向
- [ ] 轻量全局状态管理
- [ ] 版本控制+tag 管理+gitlab 流水线
- [ ] 使用类组件捕获异常
- [ ] react-router-hash-link 解决react路由带哈希不会自动滚动对应位置
- [ ] pwa, service worker (workbox-core 谷歌提供的Service Worker库，构建PWA应用)
- [ ] react-i18next, 国际化(语言、金额、日期...) 作为一个单独仓
- [ ] 统一日志，log工具。异常上报、APM。 heimdallr-sdk 轻量化的前端监控sdk

## 项目结构

```shell
i18n-fe-shop-express
├── public                     存放静态资源，如HTML模板、图标等。
│   └── favicon.ico
├── build                      构建配置
|   ├── rsbuild.base.config.ts
|   ├── rsbuild.dev.config.ts
|   ├── rsbuild.prod.config.ts
|   ├── ssr-preview-server.mjs ssr开发预览
│   └── ssr-prod-server.mjs    ssr生产预览
├── src
│   ├── assets                  存放图片、字体等静态资源。
│   │   ├──  images
|   │   └──  styles
│   ├── components              存放项目公用组件
│   ├── pages                   存放页面组件。
│   ├── locals                  国家入口
│   │   ├── in                  印度
│   │   │   ├── nation.config.ts 国家配置
│   │   │   ├── index.tsx       印度入口文件
│   │   │   └── index.html      印度html模板(可选)
│   ├── constants               常量
│   ├── renders
│   │   ├──  ClientRender.tsx   客户端渲染
│   │   ├──  Root.tsx           通用根节点
|   │   └──  SSRRender.tsx      服务端渲染
│   ├── routers
│   │   └──  index.tsx          路由配置
│   ├── utils
│   ├── types.ts
│   └── env.d.ts
├── envs.js                     环境变量
├── package.json
└── tsconfig.json
```

## 使用说明

1. 安装依赖, 直接在跟仓库安装依赖

```shell
pnpm install
```

2. 启动开发服务器

```shell
# 不带参数默认启动全部国家
pnpm dev:i18n-fe-shop-express

# 启动指定国家(在项目根目录运行需要多加一层 --)
pnpm dev:i18n-fe-shop-express -- -- --locals=in,zh-cn

# 在本目录启动
pnpm dev -- --locals=in,zh-cn
```

3. 构建生产环境代码(单页应用)

```shell
pnpm run build
```

4. 本地预览构建

此时会默认打开3000端口, 注意由于没有historyApiFallback功能，所以只能从浏览器打开chunk入口。
比如打开 http://localhost:3000/in

```shell
pnpm preview
```

5. 本地预览ssr

这是一种在开发模式就能预览ssr效果的方式，运行后，你可以右键查看网页源码，可以看到ssr编译后的html内容。
并且这种方式是还支持开发时的热更新

```shell
pnpm preview-ssr
```

6. 本地ssr渲染

对`build-all`将构建出来的产物进行服务端渲染

```shell
# 构建web和用于服务端渲染的内容
pnpm build-all

# 启动构建服务器, 此时访问 http://localhost:3000/in/home 就会服务端渲染此路由的内容
# 后续可修改express, 增加一个controller，实现post传参渲染，并返回html渲染的内容
pnpm build-ssr-server
```
