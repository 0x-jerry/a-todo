import * as env from './env'
import dayjs from 'dayjs'
import duration from 'dayjs/plugin/duration'
import { serve } from '@hono/node-server'
dayjs.extend(duration)

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
      console.log('service serve at:', `http://localhost:${info.port}`)
    },
  )
}

async function preCheck() {
  const requiredEnvs: Array<keyof typeof env> = ['APP_SECRET', 'DATABASE_URL']

  const missedEnvs = requiredEnvs.filter((name) => !env[name])

  if (missedEnvs.length) {
    throw new Error(`Please set missed environments: ${missedEnvs.join(', ')}`)
  }
}
