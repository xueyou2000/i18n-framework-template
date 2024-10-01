# i18n-fe-shop-express

国际化商城前端项目

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
pnpm dev:i18n-fe-shop-express -- -- --locals=in,kh,kh-en

# 在本目录启动
pnpm dev -- --locals=in,kh,kh-en
```

3. 构建生产环境代码

```shell
pnpm run build
```

## 注意事项
