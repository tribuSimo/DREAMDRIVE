import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import '@mdi/font/css/materialdesignicons.css'

// Vuetify
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/lib/components' // Modifica il percorso per includere i componenti correttamente
import * as directives from 'vuetify/lib/directives' // Modifica il percorso per includere le direttive correttamente
import '@mdi/font/css/materialdesignicons.min.css';

const vuetify = createVuetify({
  components,
  directives,
  icons: {
    iconfont: 'mdi',
  },
})

createApp(App)
  .use(router) // Usa il router
  .use(vuetify) // Usa Vuetify
  .mount('#app');
