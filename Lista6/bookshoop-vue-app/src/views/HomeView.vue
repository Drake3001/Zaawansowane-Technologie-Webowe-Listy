<template>
  <div class="home">
    <h2>Library Dashboard</h2>
    <div class="stats">
      <StatCard title="Total Authors" :value="stats.authors" />
      <StatCard title="Total Books" :value="stats.books" />
      <StatCard title="Total Rents" :value="stats.rents" />
    </div>
    <div class="recent-rents">
      <h3>Recent Rents</h3>
      <ul v-if="recentRents.length">
        <li v-for="rent in recentRents" :key="rent.id">
          {{ rent.book.title }} by {{ rent.readerName }} ({{ rent.rentDate }})
        </li>
      </ul>
      <p v-else>No recent rents.</p>
    </div>
    <div class="actions">
      <router-link to="/authors" class="btn">Manage Authors</router-link>
      <router-link to="/books" class="btn">Manage Books</router-link>
      <router-link to="/rents" class="btn">Manage Rents</router-link>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { getAuthors, getBooks, getRents } from '../services/api'
import StatCard from '../components/StatCard.vue'

export default {
  name: 'HomeView',
  components: {
    StatCard
  },
  setup() {
    const stats = ref({ authors: 0, books: 0, rents: 0 })
    const recentRents = ref([])

    const fetchStats = async () => {
      try {
        const [authorsRes, booksRes, rentsRes] = await Promise.all([
          getAuthors(0, 1),
          getBooks(0, 1),
          getRents(0, 5)
        ])
        stats.value.authors = authorsRes.data.totalItems
        stats.value.books = booksRes.data.totalItems
        stats.value.rents = rentsRes.data.totalItems
        recentRents.value = rentsRes.data.content
      } catch (error) {
        console.error('Error fetching stats:', error)
      }
    }

    onMounted(fetchStats)

    return { stats, recentRents }
  }
}
</script>

<style scoped>
.home {
  text-align: center;
}

.stats {
  display: flex;
  justify-content: space-around;
  margin: 2rem 0;
}

.recent-rents {
  margin: 2rem 0;
  text-align: left;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
}

.actions {
  margin-top: 2rem;
}

.btn {
  display: inline-block;
  padding: 0.5rem 1rem;
  margin: 0 0.5rem;
  background-color: #007bff;
  color: white;
  text-decoration: none;
  border-radius: 4px;
}

.btn:hover {
  background-color: #0056b3;
}
</style>