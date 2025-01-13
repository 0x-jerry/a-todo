import 'dotenv/config'

export const IS_DEV_MODE = process.env.NODE_ENV === 'development'

export const APP_SECRET = process.env.APP_SECRET || ''

export const DATABASE_URL = process.env.DATABASE_URL
