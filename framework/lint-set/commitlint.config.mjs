export default {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      [
        'feat', // 新增功能（feature）
        'fix', // 修补 bug
        'refactor', // 重构某功能（不是 feat, 不是 fix）
        'style', // 代码格式化（比如空格、缩进、末尾分号等）
        'docs', // 文档修改（比如 README.md）
        'test', // 增加测试用例等
        'perf', // 性能优化
        'revert', // 回滚某个更早之前的提交
        'build', // 构建或者 CI/CD 相关变更
        'chore' // 琐事，如移除 log、无用代码，修改翻译文案，依赖包升级，ci 构建配置更改
      ]
    ],
    'subject-full-stop': [2, 'never', '.'], // subject 结尾不加'.'
    'type-case': [2, 'always', 'lowerCase'], // type 小写
    'type-empty': [2, 'never'] // type 不为空
  }
}
