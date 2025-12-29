import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/base64',
      name: 'base64',
      component: () => import('../views/Base64View.vue'),
    },
    {
      path: '/practice',
      name: 'practice',
      component: () => import('../views/PracticeView.vue'),
    },
    {
      path: '/hash',
      name: 'hash',
      component: () => import('../views/HashView.vue'),
    },
    // 未來新增其他功能頁面，只需在這裡加入路由
    // {
    //   path: '/example',
    //   name: 'example',
    //   component: () => import('../views/ExampleView.vue'),
    // },
  ],
})

export default router
