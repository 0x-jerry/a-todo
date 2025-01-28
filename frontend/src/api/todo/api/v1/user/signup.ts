// @ts-ignore
// @ts-nocheck

import { _request, type RequestConfig } from "../../../../_adapter.ts";

export interface TypeModel {
  ApiV1UserSignupPostRequestBody: {
    name?: string;
    email: string;
    password: string;
    [k: string]: unknown;
  };
  ApiV1UserSignupPostResponse: unknown;
  [k: string]: unknown;
}

/**
 * signup
 *
 *
 *
 * url path: /api/v1/user/signup
 */
export const apiV1UserSignupPost = (
  data: TypeModel["ApiV1UserSignupPostRequestBody"],
  config?: RequestConfig,
) => {
  return _request<TypeModel["ApiV1UserSignupPostResponse"]>({
    method: "post",
    url: `/api/v1/user/signup`,
    body: data,
    config,
  });
};
