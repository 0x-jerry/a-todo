import { createApp, Plugin } from 'vue'
import App from './App.vue'

import './styles/global.less'
import 'uno.css'

const app = createApp(App)

// install all modules
Object.values(import.meta.glob<{ install: Plugin }>('./modules/*.ts', { eager: true })).forEach(
  (m) => {
    app.use(m.install)
  },
)

app.mount('#app')
