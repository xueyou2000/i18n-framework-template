/* eslint-disable @typescript-eslint/no-explicit-any */
import '@testing-library/jest-dom'
import { TextEncoder, TextDecoder } from 'util'

// mock web环境中的 TextEncoder,TextDecoder, 这些api在Node.js环境中不存在
;(global as any).TextEncoder = TextEncoder
;(global as any).TextDecoder = TextDecoder
