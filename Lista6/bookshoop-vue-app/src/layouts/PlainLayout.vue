<template>
  <div class="layout-plain">
    <header class="plain-bar">
      <router-link to="/" class="plain-brand">Library</router-link>
      <nav class="plain-links">
        <router-link to="/authors">Authors</router-link>
        <router-link to="/books">Books</router-link>
        <router-link to="/rents">Rents</router-link>
      </nav>
    </header>
    <main class="main-content">
      <router-view />
    </main>
  </div>
</template>

<script>
export default {
  name: 'PlainLayout'
}
</script>

<style scoped>
.plain-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 0.75rem 1.5rem;
  background: #f4f6f8;
  border-bottom: 1px solid #e0e4e8;
}

.plain-brand {
  font-weight: 700;
  color: #2c3e50;
  text-decoration: none;
}

.plain-links {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem 1.25rem;
}

.plain-links a {
  color: #0f3460;
  text-decoration: none;
  font-size: 0.9rem;
}

.plain-links a.router-link-active {
  font-weight: 600;
  text-decoration: underline;
}

.main-content {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}
</style>
