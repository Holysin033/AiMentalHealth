import { createRouter, createWebHashHistory, createWebHistory } from 'vue-router'
import BackendLayout from '@/layouts/BackendLayout.vue'
//配置路由表
const routes = [
  // {
  //   path: '/',
  //   redirect: '/back',
  // },
  {
    path: '/back',
    name: 'backend',
    component: BackendLayout,
    children: [
      {
        path:'dashboard',
        // name:'dashboard',
        component:()=>import('@/views/Dashboard.vue'),
      }
    ]
  },
]
const router = createRouter({
  strict: true,//严格模式
  // sensitive: true,//大小写敏感模式
  scrollBehavior: () => ({ top: 0 }), //滚动行为
  history: createWebHistory(),
  routes,
})
export default router