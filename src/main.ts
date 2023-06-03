import { createApp } from 'vue'
import App from './App.vue'

import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import 'element-plus/theme-chalk/src/dark/css-vars.scss'
import './assets/css/style.scss'
import './assets/font/iconfont.css'
import router from './router/index'
import { createPinia } from "pinia"

createApp(App)
.use(ElementPlus,{size:'small',zIndex:3000})
.use(router)
.use(createPinia())
.mount('#app')
