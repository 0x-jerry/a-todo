// @ts-ignore
// @ts-nocheck

import { _request, type RequestConfig } from "../../../../_adapter.ts";

export interface TypeModel {
  ApiV1UserLoginPostRequestBody: {
    email: string;
    password: string;
    [k: string]: unknown;
  };
  ApiV1UserLoginPostResponse: {
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
    refreshToken: string;
    [k: string]: unknown;
  };
  [k: string]: unknown;
}

/**
 * login
 *
 *
 *
 * url path: /api/v1/user/login
 */
export const apiV1UserLoginPost = (
  data: TypeModel["ApiV1UserLoginPostRequestBody"],
  config?: RequestConfig,
) => {
  return _request<TypeModel["ApiV1UserLoginPostResponse"]>({
    method: "post",
    url: `/api/v1/user/login`,
    body: data,
    config,
  });
};
