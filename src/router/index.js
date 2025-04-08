import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import GroupView from '../views/GroupView.vue'
import ExpenseView from '../views/ExpenseView.vue'
import SettlementView from '../views/SettlementView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/group/:id',
      name: 'group',
      component: GroupView
    },
    {
      path: '/group/:id/expenses',
      name: 'expenses',
      component: ExpenseView
    },
    {
      path: '/group/:id/settlement',
      name: 'settlement',
      component: SettlementView
    }
  ]
})

export default router 