import { createApp } from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import { VueFire } from 'vuefire'
import { firebaseApp } from './firebase'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap'

const app = createApp(App)
app.use(router)
app.use(VueFire, { firebaseApp })

app.mount('#app')
