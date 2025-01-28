import { createAxiosAdapter, type RequestParams } from '@0x-jerry/openapi-ts/runtime'
import { Axios, type AxiosInstance } from 'axios'

export interface RequestConfig {
  customOption?: unknown
}

const axios = new Axios()

export const _request = createAxiosAdapter(axios as AxiosInstance)
