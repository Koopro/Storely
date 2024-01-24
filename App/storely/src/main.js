import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import vuetify from './plugins/vuetify'
import { loadFonts } from './plugins/webfontloader'
import '@fortawesome/fontawesome-free/css/all.css' // Ensure you are importing the CSS


loadFonts()

createApp(App)
  .use(router)
  .use(vuetify)
  .mount('#app')
