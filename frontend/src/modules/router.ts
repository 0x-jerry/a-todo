import { createRouter, createWebHashHistory } from 'vue-router/auto'
import { routes } from 'vue-router/auto-routes'
import type { Plugin } from 'vue'

export const router = createRouter({
  history: createWebHashHistory(),
  routes,
})

export const install: Plugin = (app) => {
  app.use(router)
}
