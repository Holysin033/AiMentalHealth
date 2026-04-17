import { createApp } from 'vue'
// import './style.css' // 默认样式
import './assets/config.css'
import App from './App.vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import router from './router'

const app = createApp(App) //创建vue实例
app.use(ElementPlus)       //使用element-plus
app.use(router)            //使用路由
app.mount('#app')          //挂载到html中