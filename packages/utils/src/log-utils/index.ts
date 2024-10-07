import { createConsola } from 'consola/browser'

export const logger = createConsola({
  level: 3,
  formatOptions: {
    // columns: 180,
    colors: true,
    compact: true,
    date: true
  }
})
