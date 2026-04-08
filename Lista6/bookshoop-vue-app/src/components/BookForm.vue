<template>
  <div class="modal-overlay" @click="close">
    <div class="modal" @click.stop>
      <h3>{{ isEdit ? 'Edit Book' : 'Add Book' }}</h3>
      <form @submit.prevent="save">
        <div class="form-group">
          <label for="title">Title:</label>
          <input id="title" v-model="form.title" @blur="validateTitle" />
          <p v-if="errors.title" class="error-message">{{ errors.title }}</p>
        </div>
        <div class="form-group">
          <label for="authorId">Author:</label>
          <select id="authorId" v-model="form.authorId" @change="validateAuthorId">
            <option value="">Select Author</option>
            <option v-for="author in authors" :key="author.id" :value="author.id">
              {{ author.name }} {{ author.surname }}
            </option>
          </select>
          <p v-if="errors.authorId" class="error-message">{{ errors.authorId }}</p>
        </div>
        <div class="form-group">
          <label for="pages">Pages:</label>
          <input id="pages" v-model.number="form.pages" type="number" @blur="validatePages" />
          <p v-if="errors.pages" class="error-message">{{ errors.pages }}</p>
        </div>
        <div class="actions">
          <button type="submit" :disabled="!isFormValid" class="btn" :class="{ 'btn-disabled': !isFormValid }">{{ isEdit ? 'Update' : 'Create' }}</button>
          <button type="button" @click="close" class="btn btn-secondary">Cancel</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { ref, watch, computed } from 'vue'
import { createBook, updateBook } from '../services/api'
import { useToast } from 'vue-toastification'

export default {
  name: 'BookForm',
  props: {
    book: Object,
    authors: Array
  },
  emits: ['close', 'saved'],
  setup(props, { emit }) {
    const form = ref({ title: '', authorId: '', pages: 0 })
    const isEdit = ref(false)
    const errors = ref({ title: '', authorId: '', pages: '' })
    const toast = useToast()

    watch(() => props.book, (newBook) => {
      if (newBook) {
        form.value = { ...newBook }
        isEdit.value = true
      } else {
        form.value = { title: '', authorId: '', pages: 0 }
        isEdit.value = false
      }
      errors.value = { title: '', authorId: '', pages: '' }
    }, { immediate: true })

    const validateTitle = () => {
      if (form.value.title.trim().length === 0) {
        errors.value.title = 'Title is required'
      } else {
        errors.value.title = ''
      }
    }

    const validateAuthorId = () => {
      if (!form.value.authorId) {
        errors.value.authorId = 'Author is required'
      } else {
        errors.value.authorId = ''
      }
    }

    const validatePages = () => {
      if (form.value.pages <= 0) {
        errors.value.pages = 'Pages must be greater than 0'
      } else {
        errors.value.pages = ''
      }
    }

    const isFormValid = computed(() => {
      return form.value.title.trim().length > 0 &&
             form.value.authorId &&
             form.value.pages > 0
    })

    const save = async () => {
      if (!isFormValid.value) {
        toast.warning('Please fill all fields correctly')
        return
      }

      try {
        if (isEdit.value) {
          await updateBook(props.book.id, form.value)
          toast.success('Book updated successfully')
        } else {
          await createBook(form.value)
          toast.success('Book created successfully')
        }
        emit('saved')
      } catch (error) {
        console.error('Error saving book:', error)
        toast.error(error.displayMessage || 'Error saving book')
      }
    }

    const close = () => {
      emit('close')
    }

    return { form, isEdit, errors, isFormValid, validateTitle, validateAuthorId, validatePages, save, close }
  }
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  width: 400px;
  max-width: 90%;
}

.form-group {
  margin-bottom: 1rem;
}

label {
  display: block;
  margin-bottom: 0.5rem;
}

input, select {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.error-message {
  color: #dc3545;
  font-size: 0.85rem;
  margin: 0.25rem 0 0 0;
}

.btn-disabled,
.btn:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.btn:disabled:hover {
  background-color: #ccc;
}

.actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
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

.btn-secondary {
  background-color: #6c757d;
}

.btn-secondary:hover {
  background-color: #545b62;
}
</style>