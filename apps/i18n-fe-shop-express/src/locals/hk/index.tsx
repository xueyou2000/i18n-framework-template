// import { optimizeRoutes } from './routes'

const matchRoutePaths: string = process.env.CLIENT_PATH || ''

const array = []

if (matchRoutePaths === '/') {
  array.push('首页')
}
if (matchRoutePaths === '/home') {
  array.push('主页')
}
if (matchRoutePaths === '/about') {
  array.push('关于')
}

console.log(array)
