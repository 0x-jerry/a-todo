import { mkdir, writeFile } from 'fs/promises'
import { generateOpenapiConfig } from './utils'

const result = generateOpenapiConfig()

await mkdir('generated', { recursive: true })
await writeFile(
  'generated/openapi.json',
  JSON.stringify(result.schema, null, 2)
)

await writeFile('generated/routes.json', JSON.stringify(result.routes, null, 2))
