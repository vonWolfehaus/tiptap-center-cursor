import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import { create, NTabs, NTabPane, NConfigProvider } from 'naive-ui'

const naive = create({
    components: [NTabs, NTabPane, NConfigProvider]
})

createApp(App)
.use(naive)
.mount('#app')
