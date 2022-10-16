import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'index',
    component: () => import('@/pages/index.vue') // 注意这里要带上 文件后缀.vue
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
    path: '/token',
    name: 'token',
    component: () => import('@/pages/token.vue')
  },
  {
    path: '/tokenDetail',
    name: 'tokenDetail',
    component: () => import('@/pages/tokenDetail.vue')
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

const router = createRouter({
  history: createWebHistory(),
  routes
})
//路由导航守卫
// router.beforeEach((to, from, next) => {
//     let isAuthenticated=false
//     if (to.name !== 'Login' && !isAuthenticated) next({name: 'Login'})
//     else next()
// })
export default router
