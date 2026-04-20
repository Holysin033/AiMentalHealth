import { createRouter, createWebHashHistory, createWebHistory } from 'vue-router'
import BackendLayout from '@/layouts/BackendLayout.vue'
//配置路由表
const routes = [
  {
    path: '/back',
    name: 'backend',
    component: BackendLayout,
    children: [
      {
        path: 'dashboard',
        // name:'dashboard',
        component: () => import('@/views/DashBoard.vue'),
        meta: {
          title: '数据分析',
          icon: 'PieChart',
        }
      },
      {
        path: 'knowledge',
        component: () => import('@/views/Knowledge.vue'),
        meta: {
          title: '知识文章',
          icon: 'ChatLineSquare',
        }
      },
      {
        path: 'consultation',
        component: () => import('@/views/Consultation.vue'),
        meta: {
          title: '咨询记录',
          icon: 'Message',
        }
      },
      {
        path: 'emotion',
        component: () => import('@/views/Emotion.vue'),
        meta: {
          title: '情感日志',
          icon: 'User',
        }
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