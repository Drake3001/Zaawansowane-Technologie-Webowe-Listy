<template>
  <component :is="currentLayout">
    <router-view />
  </component>
</template>

<script>
import { ref, onMounted } from 'vue'
import DefaultLayout from './layouts/MainLayout.vue'
import AltLayout from './layouts/AltLayout.vue'

export default {
  name: 'App',
  components: {
    'default-layout': DefaultLayout,
    'alt-layout': AltLayout
  },
  setup() {
    const currentLayout = ref('default-layout')

    const toggleLayout = () => {
      currentLayout.value = currentLayout.value === 'default-layout' 
        ? 'alt-layout' 
        : 'default-layout'
      localStorage.setItem('app-layout', currentLayout.value)
    }

    onMounted(() => {
      const saved = localStorage.getItem('app-layout')
      if (saved) currentLayout.value = saved
    })

    return {
      currentLayout,
      toggleLayout
    }
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
