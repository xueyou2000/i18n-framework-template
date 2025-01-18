import { getArgv } from '@framework/build'
import { genTransJson } from './utils'
import { consola } from 'consola'

const cmd = getArgv('--cmd')

const enum CmdEnums {
  GenTrans = 'gen-trans'
}

if (cmd === CmdEnums.GenTrans) {
  consola.start('开始生成 trans.json')
  genTransJson()
    .then(() => {
      consola.success('生成 trans.json 成功')
    })
    .catch((err) => {
      consola.error('生成 trans.json 失败', err)
    })
}
