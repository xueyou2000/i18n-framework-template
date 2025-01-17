# @packages/components

react常用组件爱你

> `Rslib`默认情况下，当生成 `CJS` 或 `ESM` 产物时，`dependencies`、`optionalDependencies` 和 `peerDependencies` 字段下的三方依赖不会被 `Rslib` 打包。

> 默认这里直接走源码,不进行构建. 这样应用打包最小, 开发也最快 如果需要构建(一般用于发布npm包),则可以如下操作

1. 打开`package.json`, 进行修改
2. 修改`main`为`/dist/cjs/index.js`
3. 添加`exports`配置
4. 修改`scripts`的`build`和`dev`, 将`echo`语句去除
5. 在`main`上增加配置`"types": "./dist/esm/index.d.ts",`

具体改动如下:

```json
{
  "types": "./dist/esm/index.d.ts",
  "main": "./dist/cjs/index.js",
  "module": "./dist/esm/index.mjs",
  "exports": {
    ".": {
      "node": {
        "types": "./dist/cjs/index.d.ts",
        "import": "./dist/cjs/index.js"
      },
      "import": {
        "types": "./dist/esm/index.d.ts",
        "import": "./dist/esm/index.mjs"
      },
      "default": {
        "types": "./dist/esm/index.d.ts",
        "import": "./dist/esm/index.js"
      }
    }
  },
  "scripts": {
    "build": "rslib build",
    "dev": "rslib build --watch"
  }
}
```
