import { ROUTES_DIR } from '@/config'
import { openapiPreset } from 'openapi-ts-define'

export function generateOpenapiConfig() {
  const apiDir = ROUTES_DIR

  const result = openapiPreset({
    tsconfig: 'tsconfig.json',
    routesRoot: apiDir,
    matchFiles: ['**/*.ts', '!**/_*.ts'],
    openAPI: {
      info: {
        version: '1.0.0',
        title: 'test spec'
      }
    }
  })

  return result
}
