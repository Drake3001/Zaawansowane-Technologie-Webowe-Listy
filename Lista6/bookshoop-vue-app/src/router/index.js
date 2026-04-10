import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import AuthorsView from '../views/AuthorsView.vue'
import BooksView from '../views/BooksView.vue'
import RentsView from '../views/RentsView.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomeView,
    meta: { layout: 'main' }
  },
  {
    path: '/authors',
    name: 'Authors',
    component: AuthorsView,
    meta: { layout: 'plain' }
  },
  {
    path: '/books',
    name: 'Books',
    component: BooksView,
    meta: { layout: 'plain' }
  },
  {
    path: '/rents',
    name: 'Rents',
    component: RentsView,
    meta: { layout: 'plain' }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router