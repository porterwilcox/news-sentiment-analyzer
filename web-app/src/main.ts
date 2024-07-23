import { createApp } from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import { VueFire } from 'vuefire'
import { firebaseApp } from './firebase'
import { getAnalytics } from 'firebase/analytics'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap'

if (typeof window !== 'undefined') {
    getAnalytics(firebaseApp);
}

const app = createApp(App)
app.use(router)
app.use(VueFire, { firebaseApp })

app.mount('#app')
