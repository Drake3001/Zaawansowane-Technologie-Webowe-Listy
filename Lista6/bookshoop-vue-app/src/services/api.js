import axios from 'axios'

const baseURL = process.env.VUE_APP_API_BASE_URL || 'http://localhost:8080'

const api = axios.create({
  baseURL
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    let errorMessage = 'An error occurred'

    if (error.response) {
      switch (error.response.status) {
        case 400:
          errorMessage = 'Bad request: Invalid data'
          break
        case 404:
          errorMessage = 'Not found: Resource does not exist'
          break
        case 409:
          errorMessage = 'Conflict: Resource already exists or is unavailable'
          break
        case 500:
          errorMessage = 'Server error: Please try again later'
          break
        default:
          errorMessage = `Error: ${error.response.status} ${error.response.statusText}`
      }
    } else if (error.request) {
      errorMessage = 'Network error: Could not reach the server'
    }

    error.displayMessage = errorMessage
    return Promise.reject(error)
  }
)

// Authors
export const getAuthors = (page = 0, size = 10) => api.get(`/get/authors?page=${page}&size=${size}`)
export const getAuthor = (id) => api.get(`/get/author/${id}`)
export const createAuthor = (author) => api.post('/post/author', author)
export const updateAuthor = (id, author) => api.put(`/put/author/${id}`, author)
export const deleteAuthor = (id) => api.delete(`/delete/author/${id}`)

// Books
export const getBooks = (page = 0, size = 10) => api.get(`/get/books?page=${page}&size=${size}`)
export const getBook = (id) => api.get(`/get/book/${id}`)
export const createBook = (bookDTO) => api.post('/post/book', bookDTO)
export const updateBook = (id, bookDTO) => api.put(`/put/book/${id}`, bookDTO)
export const deleteBook = (id) => api.delete(`/delete/book/${id}`)

// Rents
export const getRents = (page = 0, size = 10) => api.get(`/get/rents?page=${page}&size=${size}`)
export const getLatestRents = (page = 0, count = 5) => api.get(`/get/rents/latest?page=${page}&count=${count}`)
export const getRent = (id) => api.get(`/get/rent/${id}`)
export const createRent = (rentDTO) => api.post('/post/rent', rentDTO)
export const updateRent = (id, rentDTO) => api.put(`/put/rent/${id}`, rentDTO)
export const returnRent = (id) => api.put(`/put/rent/return/${id}`)
export const deleteRent = (id) => api.delete(`/delete/rent/${id}`)

export default api