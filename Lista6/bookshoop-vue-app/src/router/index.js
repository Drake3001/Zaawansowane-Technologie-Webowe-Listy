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
    meta: { layout: 'default-layout' }
  },
  {
    path: '/home-alt',
    name: 'HomeAlt',
    component: HomeView,
    meta: { layout: 'alt-layout' }
  },
  {
    path: '/authors',
    name: 'Authors',
    component: AuthorsView,
    meta: { layout: 'default-layout' }
  },
  {
    path: '/books',
    name: 'Books',
    component: BooksView,
    meta: { layout: 'default-layout' }
  },
  {
    path: '/rents',
    name: 'Rents',
    component: RentsView,
    meta: { layout: 'default-layout' }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router