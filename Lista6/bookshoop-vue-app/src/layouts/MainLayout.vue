<template>
  <div class="default-layout">
    <header class="layout-header">
      <div class="layout-brand">Library Management</div>
      <nav class="layout-nav">
        <router-link to="/" class="layout-link">Home</router-link>
        <router-link to="/authors" class="layout-link">Authors</router-link>
        <router-link to="/books" class="layout-link">Books</router-link>
        <router-link to="/rents" class="layout-link">Rents</router-link>
      </nav>
    </header>

    <main class="layout-content">
      <slot />
    </main>
  </div>
</template>

<script>
export default {
  name: 'MainLayout'
}
</script>

<style scoped>
.default-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.layout-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #333;
  color: white;
  padding: 1rem 2rem;
}

.layout-brand {
  font-size: 1.25rem;
  font-weight: bold;
}

.layout-nav {
  display: flex;
  gap: 1rem;
}

.layout-link {
  color: white;
  text-decoration: none;
  padding: 0.5rem 0.75rem;
  border-radius: 4px;
}

.layout-link.router-link-active,
.layout-link:hover {
  background-color: #555;
}

.layout-content {
  flex: 1;
  padding: 2rem;
}
</style>
