<template>
  <div class="books-view">
    <h2>Books</h2>
    <button @click="showCreateForm" class="btn">Add Book</button>
    <table class="table">
      <thead>
        <tr>
          <th>ID</th>
          <th>Title</th>
          <th>Author</th>
          <th>Pages</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="book in books" :key="book.id">
          <td>{{ book.id }}</td>
          <td>{{ book.title }}</td>
          <td>{{ book.author.name }} {{ book.author.surname }}</td>
          <td>{{ book.pages }}</td>
          <td>
            <button @click="editBook(book)" class="btn-small">Edit</button>
            <button @click="deleteBook(book.id)" class="btn-small btn-danger">Delete</button>
          </td>
        </tr>
      </tbody>
    </table>
    <Pagination
      :currentPage="currentPage"
      :totalPages="totalPages"
      @page-changed="changePage"
    />
    <BookForm
      v-if="showForm"
      :book="selectedBook"
      :authors="authorsList"
      @close="closeForm"
      @saved="onSaved"
    />
  </div>
</template>

<script>
/* eslint-disable no-unused-vars */
import { ref, onMounted } from 'vue'
import { useToast } from 'vue-toastification'
import { getBooks, deleteBook as apiDeleteBook, getAuthors } from '../services/api'
import Pagination from '../components/Pagination.vue'
import BookForm from '../components/BookForm.vue'

export default {
  name: 'BooksView',
  components: {
    Pagination,
    BookForm
  },
  setup() {
    const books = ref([])
    const authorsList = ref([])
    const currentPage = ref(0)
    const totalPages = ref(0)
    const showForm = ref(false)
    const selectedBook = ref(null)

    const fetchBooks = async (page = 0) => {
      try {
        const res = await getBooks(page)
        books.value = res.data.content
        totalPages.value = res.data.totalPages
        currentPage.value = page
      } catch (error) {
        console.error('Error fetching books:', error)
      }
    }

    const fetchAuthors = async () => {
      try {
        const res = await getAuthors(0, 1000) // Fetch all authors for dropdown
        authorsList.value = res.data.content
      } catch (error) {
        console.error('Error fetching authors:', error)
      }
    }

    const showCreateForm = () => {
      selectedBook.value = null
      showForm.value = true
    }

    const toast = useToast()

    const editBook = (book) => {
      selectedBook.value = { ...book, authorId: book.author.id }
      showForm.value = true
    }

    const handleDeleteBook = async (id) => {
      if (confirm('Are you sure? This may delete related rents.')) {
        try {
          await apiDeleteBook(id)
          toast.success('Book deleted successfully')
          fetchBooks(currentPage.value)
        } catch (error) {
          console.error('Error deleting book:', error)
          toast.error(error.displayMessage || 'Error deleting book')
        }
      }
    }

    const closeForm = () => {
      showForm.value = false
      selectedBook.value = null
    }

    const onSaved = () => {
      closeForm()
      fetchBooks(currentPage.value)
    }

    const changePage = (page) => {
      fetchBooks(page)
    }

    onMounted(() => {
      fetchBooks()
      fetchAuthors()
    })

    return {
      books,
      authorsList,
      currentPage,
      totalPages,
      showForm,
      selectedBook,
      showCreateForm,
      editBook,
      deleteBook: handleDeleteBook,
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