// @ts-ignore
// @ts-nocheck

import { _request, type RequestConfig } from "../../../../../_adapter.ts";

export interface TypeModel {
  ApiV1AuthTodoCreatePostRequestBody: {
    title: string;
    [k: string]: unknown;
  };
  ApiV1AuthTodoCreatePostResponse: {
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
  };
  [k: string]: unknown;
}

/**
 * create a todo
 *
 *
 *
 * url path: /api/v1/auth/todo/create
 */
export const apiV1AuthTodoCreatePost = (
  data: TypeModel["ApiV1AuthTodoCreatePostRequestBody"],
  config?: RequestConfig,
) => {
  return _request<TypeModel["ApiV1AuthTodoCreatePostResponse"]>({
    method: "post",
    url: `/api/v1/auth/todo/create`,
    body: data,
    config,
  });
};
