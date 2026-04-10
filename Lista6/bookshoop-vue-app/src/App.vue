<template>
  <component :is="layout">
    <router-view v-slot="{ Component }">
      <component :is="Component" />
    </router-view>
  </component>
</template>

<script>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import MainLayout from './layouts/MainLayout.vue'
import PlainLayout from './layouts/PlainLayout.vue'

const layouts = {
  main: MainLayout,
  plain: PlainLayout
}

export default {
  name: 'App',
  setup() {
    const route = useRoute()
    const layout = computed(
      () => layouts[route.meta.layout] || PlainLayout
    )
    return { layout }
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
