import { createApp, type Plugin } from 'vue'
import { createVuetify } from 'vuetify'
import { aliases, mdi } from 'vuetify/iconsets/mdi-svg'
import App from './App.vue'

import './styles/global.less'
import 'uno.css'

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

app.mount('#app')
