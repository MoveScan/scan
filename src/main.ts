import { createApp } from 'vue'
import App from './App.vue'
import { createPinia } from 'pinia'
import router from './router/router'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import 'element-plus/theme-chalk/dark/css-vars.css'
import './styles/dark/css-vars.css'
import './styles/main.css'
import i18n from './i18n/index'
import * as echarts from 'echarts'
import JsonViewer from 'vue-json-viewer'

const app = createApp(App)
app.config.globalProperties.$echarts = echarts
app.use(createPinia()).use(router).use(ElementPlus, { size: '', zIndex: 3000 }).use(i18n).use(JsonViewer)
app.mount('#app')
