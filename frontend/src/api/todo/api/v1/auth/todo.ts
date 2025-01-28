// @ts-ignore
// @ts-nocheck

import { _request, type RequestConfig } from "../../../../_adapter.ts";

export interface TypeModel {
  ApiV1AuthTodoPostRequestBody: IPagination;
  ApiV1AuthTodoPostResponse: {
    total: number;
    data: {
      id: number;
      createdAt: number;
      updatedAt: number;
      userId: number;
      title: string;
      priority: number;
      note: unknown;
      done: boolean;
      doneAt: unknown;
      collectionId: unknown;
      [k: string]: unknown;
    }[];
    [k: string]: unknown;
  };
  [k: string]: unknown;
}
export interface IPagination {
  page?: number;
  size?: number;
  data?: RecordStringString;
  [k: string]: unknown;
}
export interface RecordStringString {
  [k: string]: unknown;
}

/**
 * list todos
 *
 *
 *
 * url path: /api/v1/auth/todo
 */
export const apiV1AuthTodoPost = (
  data: TypeModel["ApiV1AuthTodoPostRequestBody"],
  config?: RequestConfig,
) => {
  return _request<TypeModel["ApiV1AuthTodoPostResponse"]>({
    method: "post",
    url: `/api/v1/auth/todo`,
    body: data,
    config,
  });
};
