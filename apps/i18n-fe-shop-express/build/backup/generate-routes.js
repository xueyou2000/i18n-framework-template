/* eslint-disable quotes */
/* eslint-disable @typescript-eslint/no-require-imports */
/* eslint-disable no-undef */
const fs = require('node:fs')
const path = require('node:path')

const allRoutes = [
  { path: '/', element: "import(() => './pages/index.tsx')" },
  { path: '/home', element: "import(() => './pages/home.tsx')" },
  { path: '/about', element: "import(() => './pages/about.tsx')" }
]

// TODO: 这里应该读取routes.tsx路由配置文件内容，然后根据匹配路由，过滤内容，再写到routes.generated.ts中

const matchRoutePaths = JSON.parse(process.env.CLIENT_ARR || '') || []

const filteredRoutes = allRoutes.filter((route) => matchRoutePaths.includes(route.path))

const routesContent = `export const routes = ${JSON.stringify(filteredRoutes)};`

fs.writeFileSync(path.resolve(__dirname, '../src/routes/routes.generated.ts'), routesContent)
