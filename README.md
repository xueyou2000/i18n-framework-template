# i18n-framework-template

## 介绍(Introduction)

一个国际化项目模板，基于 React + TypeScript + turbo + rspack 构建。

## 路线图(Roadmap)

- [x] turbo repo + pnpm workspace 构建多仓库
- [x] eslint + stylelint + prettierrc + commitlint + husky 单独作为一个基础仓库
- [ ] 响应式布局, 5 个断点， 字体大小自适应，
- [ ] 轻量全局状态管理
- [ ] seo 信息在编译 html 时候注入
- [ ] 版本控制+tag 管理+gitlab 流水线
- [ ] 使用类组件捕获异常
- [ ] pwa, service worker
- [ ] 国际化(语言、金额、日期...) 作为一个单独仓
- [x] 不同语言入口可能不同
- [ ] 统一日志，log工具

## RsBuild 学习记录

### rsbuild-cli

options:

- `-m, --mode <mode>` 指定构建模式，可以是 `development`，`production` 或 `none`
