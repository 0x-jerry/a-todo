// @ts-ignore
// @ts-nocheck

import { _request, type RequestConfig } from "../../../../_adapter.ts";

export interface TypeModel {
  ApiV1UserAuthPostRequestBody: {
    refreshToken: string;
    [k: string]: unknown;
  };
  ApiV1UserAuthPostResponse: {
    user: {
      id: number;
      createdAt: number;
      updatedAt: number;
      name: unknown;
      email: string;
      password: string;
      isAdmin: unknown;
      [k: string]: unknown;
    };
    token: string;
    newRefreshToken: string;
    [k: string]: unknown;
  };
  [k: string]: unknown;
}

/**
 * exchange token
 *
 *
 *
 * url path: /api/v1/user/auth
 */
export const apiV1UserAuthPost = (
  data: TypeModel["ApiV1UserAuthPostRequestBody"],
  config?: RequestConfig,
) => {
  return _request<TypeModel["ApiV1UserAuthPostResponse"]>({
    method: "post",
    url: `/api/v1/user/auth`,
    body: data,
    config,
  });
};
