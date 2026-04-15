import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import AuthorsView from '../views/AuthorsView.vue'
import BooksView from '../views/BooksView.vue'
import RentsView from '../views/RentsView.vue'

/** Klucze layoutów — zgodne z mapą w App.vue i z meta.layout poniżej */
export const LAYOUT_MAIN = 'main'
export const LAYOUT_PLAIN = 'plain'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomeView,
    meta: { layout: LAYOUT_MAIN }
  },
  {
    path: '/authors',
    name: 'Authors',
    component: AuthorsView,
    meta: { layout: LAYOUT_PLAIN }
  },
  {
    path: '/books',
    name: 'Books',
    component: BooksView,
    meta: { layout: LAYOUT_PLAIN }
  },
  {
    path: '/rents',
    name: 'Rents',
    component: RentsView,
    meta: { layout: LAYOUT_PLAIN }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
