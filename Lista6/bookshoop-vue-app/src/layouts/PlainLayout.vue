<template>
  <div class="layout-plain">
    <main class="main-content">
      <slot />
    </main>
  </div>
</template>

<script>
export default {
  name: 'PlainLayout'
}
</script>

<style scoped>
.main-content {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}
</style>
