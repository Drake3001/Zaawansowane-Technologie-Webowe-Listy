<template>
  <div class="layout-main">
    <nav class="navbar">
      <div class="nav-container">
        <h1 class="nav-title">Library Management</h1>
        <ul class="nav-menu">
          <li><router-link to="/" class="nav-link">Home</router-link></li>
          <li><router-link to="/authors" class="nav-link">Authors</router-link></li>
          <li><router-link to="/books" class="nav-link">Books</router-link></li>
          <li><router-link to="/rents" class="nav-link">Rents</router-link></li>
        </ul>
      </div>
    </nav>
    <main class="main-content">
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
.navbar {
  background-color: #333;
  color: white;
  padding: 1rem;
}

.nav-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
}

.nav-title {
  margin: 0;
}

.nav-menu {
  list-style: none;
  display: flex;
  gap: 1rem;
  margin: 0;
  padding: 0;
}

.nav-link {
  color: white;
  text-decoration: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  transition: background-color 0.3s;
}

.nav-link:hover,
.nav-link.router-link-active {
  background-color: #555;
}

.main-content {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}
</style>