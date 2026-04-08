import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import AuthorsView from '../views/AuthorsView.vue'
import BooksView from '../views/BooksView.vue'
import RentsView from '../views/RentsView.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomeView
  },
  {
    path: '/authors',
    name: 'Authors',
    component: AuthorsView
  },
  {
    path: '/books',
    name: 'Books',
    component: BooksView
  },
  {
    path: '/rents',
    name: 'Rents',
    component: RentsView
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router