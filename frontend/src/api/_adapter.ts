import { createAxiosAdapter, type RequestParams } from '@0x-jerry/openapi-ts/runtime'
import Axios from 'axios'

export interface RequestConfig {
  customOption?: unknown
}

const axios = Axios.create({})

export const _request = createAxiosAdapter(axios)
