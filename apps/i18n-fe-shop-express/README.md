# i18n-fe-shop-express

国际化商城前端项目

[github pages](https://xueyou2000.github.io/i18n-framework-template/zh-cn/)

## 项目结构

```shell
i18n-fe-shop-express
├── public                     存放静态资源，如HTML模板、图标等。
│   └── favicon.ico
├── build                      构建配置
|   ├── rsbuild.base.config.ts
|   ├── rsbuild.dev.config.ts
│   └── rsbuild.prod.config.ts
├── src
│   ├── assets                  存放图片、字体等静态资源。
│       ├──  images
|       └──  styles
│   ├── components              存放项目公用组件
│   ├── pages                   存放页面组件。
│   ├── utils
│   ├── App.tsx
│   ├── index.tsx
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

## 注意事项

## todo

- react-i18next
- react-router-hash-link 解决react路由带哈希不会自动滚动对应位置
- react-helmet
- heimdallr-sdk 轻量化的前端监控sdk
- workbox-core 谷歌提供的Service Worker库，构建PWA应用
- 现代化响应式网页开发
- 国际化与书写方向
