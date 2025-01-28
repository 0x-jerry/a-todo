import { createRouter, createWebHashHistory } from 'vue-router/auto'
import { routes } from 'vue-router/auto-routes'
import { Plugin } from 'vue'

export const install: Plugin = (app) => {
  const router = createRouter({
    history: createWebHashHistory(),
    routes,
  })

  app.use(router)
}
