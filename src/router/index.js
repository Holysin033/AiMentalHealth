import { createRouter, createWebHashHistory, createWebHistory } from 'vue-router'
import BackendLayout from '@/layouts/BackendLayout.vue'
import FrontendLayout from '@/layouts/FrontendLayout.vue'
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
]
const frontendRoutes = [
  {
    path: '/',
    redirect: '/front/index',
  }
  ,
  {
    path: '/front',
    name: 'frontend',
    component: FrontendLayout,
    children: [
      {
        path: 'index',
        name: 'home',
        component: () => import('@/views/frontend/Index.vue'),
        meta: {
          title: '首页',
        }
      },
      {
        path: 'knowledge',
        name: 'knowledge',
        component: () => import('@/views/frontend/Knowledge.vue'),
        meta: {
          title: '知识库',
        }
      },
      {
        path: 'consultation',
        name: 'consultation',
        component: () => import('@/views/frontend/Consulation.vue'),
        meta: {
          title: '咨询',
        }
      },
      {
        path: 'emotion',
        name: 'emotion',
        component: () => import('@/views/frontend/Emotion.vue'),
        meta: {
          title: '情感日记',
        }
      },
    ]
  }
]
const commonRoutes = [{
  path: '/auth',
  name: 'auth',
  component: AuthLayout,
  children: [
    {
      path: 'login',
      name: 'login',
      component: () => import('@/views/auth/Login.vue'),
      meta: {
        title: '登录',
      }
    },
    {
      path: 'register',
      name: 'register',
      component: () => import('@/views/auth/Register.vue'),
      meta: {
        title: '注册',
      }
    }
  ]
}]

const router = createRouter({
  strict: true,//严格模式,是否禁止尾部斜线。
  // sensitive: true,//大小写敏感模式
  scrollBehavior: () => ({ top: 0 }), //滚动行为
  history: createWebHistory(),
  routes: [...backendRoutes, ...frontendRoutes, ...commonRoutes],
  base: '/',
})

// 路由守卫
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')

  if (!token) {
    // 如果已经在登录页面，不再重定向，避免无限循环
    if (to.path === '/auth/login') {
      next()
      return
    }
    next('/auth/login')
    return
  }

  try {
    const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}')
    // 后台用户
    if (userInfo.userType === 2) {
      if (to.path.startsWith('/back')) {
        next()
      } else {
        next('/back/dashboard')
      }
    }
    // 前台用户
    else if (userInfo.userType === 1) {
      if (to.path.startsWith('/front')) {
        next()
      } else {
        next('/front/index')
      }
    }
    else {
      // 普通用户或其他类型，跳转到登录
      next('/auth/login')
    }
  } catch (e) {
    // 解析失败，清除无效数据并跳转登录
    localStorage.removeItem('token')
    localStorage.removeItem('userInfo')
    next('/auth/login')
  }
})


// 导出路由实例
export default router