import * as env from './env'
import dayjs from 'dayjs'
import duration from 'dayjs/plugin/duration'
import relativeTime from 'dayjs/plugin/relativeTime'
import { serve } from '@hono/node-server'
import { appLogger } from './services/logger'

dayjs.extend(duration)
dayjs.extend(relativeTime)

await preCheck()

await start()

async function start() {
  const { app } = await import('./app')

  serve(
    {
      port: 3560,
      fetch: app.fetch,
    },
    (info) => {
      appLogger.info('service serve at: %s', `http://localhost:${info.port}`)
    },
  )

  await import('./cronjobs')
}

async function preCheck() {
  const requiredEnvs: Array<keyof typeof env> = ['APP_SECRET', 'DATABASE_URL']

  const missedEnvs = requiredEnvs.filter((name) => !env[name])

  if (missedEnvs.length) {
    throw new Error(`Please set missed environments: ${missedEnvs.join(', ')}`)
  }
}
