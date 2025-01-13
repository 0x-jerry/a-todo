import 'dotenv/config'
import { app } from './app'
import { serve } from '@hono/node-server'

serve(
  {
    port: 3560,
    fetch: app.fetch
  },
  (info) => {
    console.log('service serve at:', `http://localhost:${info.port}`)
  }
)
