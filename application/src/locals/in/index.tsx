import { init } from '../common'

import { nationConfig, nationRoutes } from './nation.config'

// import 'dayjs/locale/zh-cn'

// eslint-disable-next-line @typescript-eslint/no-require-imports
init(nationConfig, nationRoutes, require('./translation.json'))
