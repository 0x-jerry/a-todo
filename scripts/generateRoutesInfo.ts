import { mkdir, writeFile } from 'node:fs/promises'
import { generateOpenapiConfig } from './utils'

const result = generateOpenapiConfig()

for (const route of result.routes) {
  route.meta.filepath = route.meta.filepath.replace(/\.ts$/, '.js')
}

await mkdir('generated', { recursive: true })
await writeFile('generated/openapi.json', JSON.stringify(result.schema, null, 2))

await writeFile('generated/routes.json', JSON.stringify(result.routes, null, 2))
