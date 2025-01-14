import 'dotenv/config'

export const IS_DEV_MODE = process.env.NODE_ENV === 'development'

export const APP_SECRET = process.env.APP_SECRET || ''

export const APP_REFRESH_SECRET = `${APP_SECRET}_refresh_secret`

export const DATABASE_URL = process.env.DATABASE_URL
