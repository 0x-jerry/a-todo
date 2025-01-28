// @ts-ignore
// @ts-nocheck

import { _request, type RequestConfig } from "../../../../../_adapter.ts";

export interface TypeModel {
  ApiV1AuthUserValidateGetResponse: {
    [k: string]: unknown;
  };
  [k: string]: unknown;
}

/**
 * check token validation
 *
 *
 *
 * url path: /api/v1/auth/user/validate
 */
export const apiV1AuthUserValidateGet = (config?: RequestConfig) => {
  return _request<TypeModel["ApiV1AuthUserValidateGetResponse"]>({
    method: "get",
    url: `/api/v1/auth/user/validate`,
    config,
  });
};
