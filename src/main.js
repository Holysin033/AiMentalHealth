import { createApp } from 'vue'
// import './style.css' // 默认样式
import './assets/config.css'
import App from './App.vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'// 引入element-plus的样式(已经使用自动导入，不需要引入了)
import router from './router'
import { createPinia } from 'pinia'
import {createPersistedState} from 'pinia-persistedstate-plugin'

const pinia = createPinia()
pinia.use(createPersistedState())

const app = createApp(App) //创建vue实例
app.use(ElementPlus)       //使用element-plus
app.use(router)            //使用路由
app.use(pinia)              //使用pinia,并添加持久化插件
app.mount('#app')          //挂载到html中