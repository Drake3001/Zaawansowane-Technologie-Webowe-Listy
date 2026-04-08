<template>
  <div class="rents-view">
    <h2>Rents</h2>
    <button @click="showCreateForm" class="btn">Add Rent</button>
    <table class="table">
      <thead>
        <tr>
          <th>ID</th>
          <th>Book</th>
          <th>Reader</th>
          <th>Rent Date</th>
          <th>Return Date</th>
          <th>Returned</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="rent in rents" :key="rent.id">
          <td>{{ rent.id }}</td>
          <td>{{ rent.book.title }}</td>
          <td>{{ rent.readerName }}</td>
          <td>{{ rent.rentDate }}</td>
          <td>{{ rent.returnDate || '-' }}</td>
          <td>{{ rent.returned ? 'Yes' : 'No' }}</td>
          <td>
            <button @click="editRent(rent)" class="btn-small">Edit</button>
            <button v-if="!rent.returned" @click="returnRent(rent.id)" class="btn-small btn-success">Return</button>
            <button @click="deleteRent(rent.id)" class="btn-small btn-danger">Delete</button>
          </td>
        </tr>
      </tbody>
    </table>
    <Pagination
      :currentPage="currentPage"
      :totalPages="totalPages"
      @page-changed="changePage"
    />
    <RentForm
      v-if="showForm"
      :rent="selectedRent"
      :books="booksList"
      @close="closeForm"
      @saved="onSaved"
    />
  </div>
</template>

<script>
/* eslint-disable no-unused-vars */
import { ref, onMounted } from 'vue'
import { useToast } from 'vue-toastification'
import { getRents, deleteRent as apiDeleteRent, returnRent as apiReturnRent, getBooks } from '../services/api'
import Pagination from '../components/Pagination.vue'
import RentForm from '../components/RentForm.vue'

export default {
  name: 'RentsView',
  components: {
    Pagination,
    RentForm
  },
  setup() {
    const rents = ref([])
    const booksList = ref([])
    const currentPage = ref(0)
    const totalPages = ref(0)
    const showForm = ref(false)
    const selectedRent = ref(null)

    const fetchRents = async (page = 0) => {
      try {
        const res = await getRents(page)
        rents.value = res.data.content
        totalPages.value = res.data.totalPages
        currentPage.value = page
      } catch (error) {
        console.error('Error fetching rents:', error)
      }
    }

    const fetchBooks = async () => {
      try {
        const res = await getBooks(0, 1000) // Fetch all books for dropdown
        booksList.value = res.data.content
      } catch (error) {
        console.error('Error fetching books:', error)
      }
    }

    const showCreateForm = () => {
      selectedRent.value = null
      showForm.value = true
    }

    const toast = useToast()

    const editRent = (rent) => {
      selectedRent.value = { ...rent, bookId: rent.book.id }
      showForm.value = true
    }

    const handleReturnRent = async (id) => {
      try {
        await apiReturnRent(id)
        toast.success('Rent returned successfully')
        fetchRents(currentPage.value)
      } catch (error) {
        console.error('Error returning rent:', error)
        toast.error(error.displayMessage || 'Error returning rent')
      }
    }

    const handleDeleteRent = async (id) => {
      if (confirm('Are you sure?')) {
        try {
          await apiDeleteRent(id)
          toast.success('Rent deleted successfully')
          fetchRents(currentPage.value)
        } catch (error) {
          console.error('Error deleting rent:', error)
          toast.error(error.displayMessage || 'Error deleting rent')
        }
      }
    }

    const closeForm = () => {
      showForm.value = false
      selectedRent.value = null
    }

    const onSaved = () => {
      closeForm()
      fetchRents(currentPage.value)
    }

    const changePage = (page) => {
      fetchRents(page)
    }

    onMounted(() => {
      fetchRents()
      fetchBooks()
    })

    return {
      rents,
      booksList,
      currentPage,
      totalPages,
      showForm,
      selectedRent,
      showCreateForm,
      editRent,
      returnRent: handleReturnRent,
      deleteRent: handleDeleteRent,
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

.btn-success {
  background-color: #28a745;
}

.btn-success:hover {
  background-color: #218838;
}
</style>