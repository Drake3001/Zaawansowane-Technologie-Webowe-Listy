<template>
  <component :is="layoutComponent" />
</template>

<script>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import MainLayout from './layouts/MainLayout.vue'
import PlainLayout from './layouts/PlainLayout.vue'
import { LAYOUT_MAIN } from './router'

const layouts = {
  main: MainLayout,
  plain: PlainLayout
}

export default {
  name: 'App',
  setup() {
    const route = useRoute()
    const layoutComponent = computed(() => {
      const key = route.meta.layout || LAYOUT_MAIN
      return layouts[key] || MainLayout
    })
    return { layoutComponent }
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  min-height: 100vh;
}
</style>
