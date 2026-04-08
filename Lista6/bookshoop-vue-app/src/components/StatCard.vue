<template>
  <div class="stat-card">
    <h3>{{ title }}</h3>
    <p>{{ value }}</p>
  </div>
</template>

<script>
export default {
  name: 'StatCard',
  props: {
    title: String,
    value: Number
  }
}
</script>

<style scoped>
.stat-card {
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 1rem;
  text-align: center;
  background-color: #f9f9f9;
}

.stat-card h3 {
  margin: 0 0 0.5rem 0;
}

.stat-card p {
  font-size: 2rem;
  margin: 0;
  color: #333;
}
</style>