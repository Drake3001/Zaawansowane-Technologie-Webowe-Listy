import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import Toast from 'vue-toastification'
import 'vue-toastification/dist/index.css'
import AltLayout from './layouts/AltLayout.vue'
import MainLayout from './layouts/MainLayout.vue'

const app = createApp(App)

app.component('default-layout', MainLayout)
app.component('alt-layout', AltLayout)

app.use(router)
app.use(Toast, {
  position: 'top-right',
  timeout: 3000,
  pauseOnHover: true
})

app.mount('#app')
