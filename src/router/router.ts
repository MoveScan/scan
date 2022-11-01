import { createRouter, createWebHistory, createWebHashHistory, RouteRecordRaw } from 'vue-router'
import { close, start } from '@/router/nprogress'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'index',
    component: () => import('@/pages/index.vue') // 注意这里要带上 文件后缀.vue
  },
  {
    path: '/tips',
    name: 'tips',
    component: () => import('@/pages/tips.vue')
  },
  {
    path: '/node',
    name: 'node',
    component: () => import('@/pages/node.vue')
  },
  {
    path: '/blocks',
    name: 'blocks',
    component: () => import('@/pages/blocks.vue')
  },
  {
    path: '/blocksDetail',
    name: 'blocksDetail',
    component: () => import('@/pages/blocksDetail.vue')
  },
  {
    path: '/transaction',
    name: 'transaction',
    component: () => import('@/pages/transaction.vue')
  },
  {
    path: '/transactionDetail',
    name: 'transactionDetail',
    component: () => import('@/pages/transactionDetail.vue')
  },
  {
    path: '/transfer',
    name: 'transfer',
    component: () => import('@/pages/transfer.vue')
  },
  {
    path: '/account',
    name: 'account',
    component: () => import('@/pages/account.vue')
  },
  {
    path: '/accountDetail',
    name: 'accountDetail',
    component: () => import('@/pages/accountDetail.vue')
  },
  {
    path: '/coin',
    name: 'coin',
    component: () => import('@/pages/coin.vue')
  },
  {
    path: '/coinDetail',
    name: 'coinDetail',
    component: () => import('@/pages/coinDetail.vue')
  },
  {
    path: '/Login',
    name: 'Login',
    component: () => import('@/pages/Login/Login.vue')
  },
  {
    path: '/main',
    name: 'Main',
    component: () => import('@/pages/Main/Main.vue')
    // children: [],//子组件
  }
]

// createWebHistory路由模式路径不带#号(生产环境下不能直接访问项目，需要nginx转发)
const router = createRouter({
  history: createWebHashHistory(),
  routes
})
router.beforeEach((pre, next) => {
  start()
})

router.afterEach(() => {
  close()
})
//路由导航守卫
// router.beforeEach((to, from, next) => {
//     let isAuthenticated=false
//     if (to.name !== 'Login' && !isAuthenticated) next({name: 'Login'})
//     else next()
// })
export default router
