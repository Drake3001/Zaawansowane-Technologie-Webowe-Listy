<template>
  <div class="authors-view">
    <h2>Authors</h2>
    <button @click="showCreateForm" class="btn">Add Author</button>
    <table class="table">
      <thead>
        <tr>
          <th>ID</th>
          <th>Name</th>
          <th>Surname</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="author in authors" :key="author.id">
          <td>{{ author.id }}</td>
          <td>{{ author.name }}</td>
          <td>{{ author.surname }}</td>
          <td>
            <button @click="editAuthor(author)" class="btn-small">Edit</button>
            <button @click="deleteAuthor(author.id)" class="btn-small btn-danger">Delete</button>
          </td>
        </tr>
      </tbody>
    </table>
    <Pagination
      :currentPage="currentPage"
      :totalPages="totalPages"
      @page-changed="changePage"
    />
    <AuthorForm
      v-if="showForm"
      :author="selectedAuthor"
      @close="closeForm"
      @saved="onSaved"
    />
  </div>
</template>

<script>
/* eslint-disable no-unused-vars */
import { ref, onMounted } from 'vue'
import { useToast } from 'vue-toastification'
import { getAuthors, deleteAuthor as apiDeleteAuthor } from '../services/api'
import Pagination from '../components/Pagination.vue'
import AuthorForm from '../components/AuthorForm.vue'

export default {
  name: 'AuthorsView',
  components: {
    Pagination,
    AuthorForm
  },
  setup() {
    const authors = ref([])
    const currentPage = ref(0)
    const totalPages = ref(0)
    const showForm = ref(false)
    const selectedAuthor = ref(null)

    const fetchAuthors = async (page = 0) => {
      try {
        const res = await getAuthors(page)
        authors.value = res.data.content
        totalPages.value = res.data.totalPages
        currentPage.value = page
      } catch (error) {
        console.error('Error fetching authors:', error)
      }
    }

    const toast = useToast()

    const showCreateForm = () => {
      selectedAuthor.value = null
      showForm.value = true
    }

    const editAuthor = (author) => {
      selectedAuthor.value = { ...author }
      showForm.value = true
    }

    const handleDeleteAuthor = async (id) => {
      if (confirm('Are you sure?')) {
        try {
          await apiDeleteAuthor(id)
          toast.success('Author deleted successfully')
          fetchAuthors(currentPage.value)
        } catch (error) {
          console.error('Error deleting author:', error)
          toast.error(error.displayMessage || 'Error deleting author')
        }
      }
    }

    const closeForm = () => {
      showForm.value = false
      selectedAuthor.value = null
    }

    const onSaved = () => {
      closeForm()
      fetchAuthors(currentPage.value)
    }

    const changePage = (page) => {
      fetchAuthors(page)
    }

    onMounted(() => fetchAuthors())

    return {
      authors,
      currentPage,
      totalPages,
      showForm,
      selectedAuthor,
      showCreateForm,
      editAuthor,
      deleteAuthor: handleDeleteAuthor,
      closeForm,
      onSaved,
      changePage
    }
  }
}
</script>

<style scoped>
.table {
  width: 100%;
  border-collapse: collapse;
  margin: 1rem 0;
}

.table th, .table td {
  border: 1px solid #ddd;
  padding: 0.5rem;
  text-align: left;
}

.btn {
  background-color: #007bff;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
}

.btn:hover {
  background-color: #0056b3;
}

.btn-small {
  padding: 0.25rem 0.5rem;
  margin: 0 0.25rem;
}

.btn-danger {
  background-color: #dc3545;
}

.btn-danger:hover {
  background-color: #c82333;
}
</style>