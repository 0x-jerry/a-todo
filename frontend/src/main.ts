import { createApp, type Plugin } from 'vue'
import { createVuetify } from 'vuetify'
import { aliases, mdi } from 'vuetify/iconsets/mdi-svg'
import App from './App.vue'

import './styles/global.less'
import 'uno.css'
import { apiV1AuthUserValidateGet } from './api/todo'
import { router } from './modules/router'

const app = createApp(App)

app.use(
  createVuetify({
    icons: {
      defaultSet: 'mdi',
      aliases,
      sets: {
        mdi,
      },
    },
  }),
)

// install all modules
Object.values(import.meta.glob<{ install: Plugin }>('./modules/*.ts', { eager: true })).forEach(
  (m) => {
    app.use(m.install)
  },
)

start()

async function start() {
  const isLoginPage = router.currentRoute.value.path === '/login'

  if (!isLoginPage) {
    try {
      await apiV1AuthUserValidateGet()
    } catch (error) {
      console.error(error)
      router.push('/login')
    }
  }

  app.mount('#app')
}
