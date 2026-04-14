import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

const app = createApp(App) //创建vue实例
app.use(ElementPlus)       //使用element-plus
app.mount('#app')          //挂载到html中