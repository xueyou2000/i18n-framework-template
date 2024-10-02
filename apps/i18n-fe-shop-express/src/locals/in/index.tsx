import '@/assets/styles/themes/index.scss'
import { setupApp } from '../index'

console.log('>>> local in')

console.log('>>>', import.meta.env.MODE)

console.log('>>>', process.env.NODE_ENV)

console.log('>>>', process.env.CLIENT_ENV)

setupApp()
