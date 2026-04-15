<template>
  <div class="alt-layout">
    <slot />
  </div>
</template>

<script>
export default {
  name: 'AltLayout'
}
</script>

<style scoped>
.alt-layout {
  min-height: 100vh;
  padding: 2rem;
}
</style>
