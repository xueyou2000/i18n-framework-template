# i18n-framework-template

## 介绍(Introduction)

> 请安装较新版本的vscode, eslint最新版需要它

一个国际化项目模板，基于 React + TypeScript + turbo + rspack 构建。

## 项目结构

```shell
i18n-framework-template
├── apps
│   └── i18n-fe-shop-express    国际化前端项目
├── framework
|   ├── build                   rsbuild工具包
|   ├── config-ts               ts通用配置
│   └── lint-set                eslint,stylelint配置与依赖
├── packages
│   └── utils                   工具包
├── turbo.json                  turbo配置
├── eslint.config.mjs           eslint配置
├── .prettierrc                 prettier配置
├── stylelint.config.mjs        stylelint配置
├── pnpm-workspace.yaml         多仓配置
├── package.json
└── tsconfig.json
```

## 使用(Usage)

1. 安装依赖，多仓项目，直接在根仓库安装依赖即可

```shell
pnpm install
```

2. 启动i18n项目

```shell
# 不带参数默认启动全部国家
pnpm dev:i18n-fe-shop-express

# 启动指定国家(在项目根目录运行需要多加一层 --)
pnpm dev:i18n-fe-shop-express -- -- --locals=in,zh-cn
```
