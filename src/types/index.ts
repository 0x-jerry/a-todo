export interface IPagination<T extends Record<string, string> = Record<string, string>> {
  page?: number
  size?: number
  data?: T
}
