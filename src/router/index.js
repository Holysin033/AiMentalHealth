import { createRouter, createWebHashHistory, createWebHistory } from 'vue-router'
import BackendLayout from '@/layouts/BackendLayout.vue'
import AuthLayout from '@/layouts/AuthLayout.vue'


//配置路由表
const backendRoutes = [
  {
    path: '/back',
    name: 'backend',
    component: BackendLayout,
    children: [
      {
        path: 'dashboard',
        // name:'dashboard',
        component: () => import('@/views/backend/DashBoard.vue'),
        meta: {
          title: '数据分析',
          icon: 'PieChart',
        }
      },
      {
        path: 'knowledge',
        component: () => import('@/views/backend/Knowledge.vue'),
        meta: {
          title: '知识文章',
          icon: 'ChatLineSquare',
        }
      },
      {
        path: 'consultation',
        component: () => import('@/views/backend/Consultation.vue'),
        meta: {
          title: '咨询记录',
          icon: 'Message',
        }
      },
      {
        path: 'emotion',
        component: () => import('@/views/backend/Emotion.vue'), //Emotion.vue
        meta: {
          title: '情感日志',
          icon: 'User',
        }
      }
    ]
  },
  {
    path:'/auth',
    name:'auth',
    component: AuthLayout,
    children:[
      {
        path:'login',
        name:'login',
        component: () => import('@/views/auth/Login.vue'),
        meta: {
          title: '登录',
        }
      },
      {
        path:'register',
        name:'register',
        component: () => import('@/views/auth/Register.vue'),
        meta: {
          title: '注册',
        }
      }
    ]
  }
]
const router = createRouter({
  strict: true,//严格模式,是否禁止尾部斜线。
  // sensitive: true,//大小写敏感模式
  scrollBehavior: () => ({ top: 0 }), //滚动行为
  history: createWebHistory(),
  routes: backendRoutes,
  base: '/',
})
export default router