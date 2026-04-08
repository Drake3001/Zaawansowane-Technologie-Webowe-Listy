<template>
  <div class="modal-overlay" @click="close">
    <div class="modal" @click.stop>
      <h3>{{ isEdit ? 'Edit Rent' : 'Add Rent' }}</h3>
      <form @submit.prevent="save">
        <div class="form-group">
          <label for="bookId">Book:</label>
          <select id="bookId" v-model="form.bookId" @change="validateBookId">
            <option value="">Select Book</option>
            <option v-for="book in books" :key="book.id" :value="book.id">
              {{ book.title }} by {{ book.author.name }} {{ book.author.surname }}
            </option>
          </select>
          <p v-if="errors.bookId" class="error-message">{{ errors.bookId }}</p>
        </div>
        <div class="form-group">
          <label for="readerName">Reader Name:</label>
          <input id="readerName" v-model="form.readerName" @blur="validateReaderName" />
          <p v-if="errors.readerName" class="error-message">{{ errors.readerName }}</p>
        </div>
        <div class="form-group" v-if="isEdit">
          <label for="rentDate">Rent Date:</label>
          <input id="rentDate" v-model="form.rentDate" type="date" />
        </div>
        <div class="form-group" v-if="isEdit">
          <label for="returnDate">Return Date:</label>
          <input id="returnDate" v-model="form.returnDate" type="date" />
        </div>
        <div class="form-group" v-if="isEdit">
          <label>
            <input type="checkbox" v-model="form.returned" />
            Returned
          </label>
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
import { createRent, updateRent } from '../services/api'
import { useToast } from 'vue-toastification'

export default {
  name: 'RentForm',
  props: {
    rent: Object,
    books: Array
  },
  emits: ['close', 'saved'],
  setup(props, { emit }) {
    const form = ref({ bookId: '', readerName: '', rentDate: '', returnDate: '', returned: false })
    const isEdit = ref(false)
    const errors = ref({ bookId: '', readerName: '' })
    const toast = useToast()

    watch(() => props.rent, (newRent) => {
      if (newRent) {
        form.value = { ...newRent }
        isEdit.value = true
      } else {
        form.value = { bookId: '', readerName: '', rentDate: '', returnDate: '', returned: false }
        isEdit.value = false
      }
      errors.value = { bookId: '', readerName: '' }
    }, { immediate: true })

    const validateBookId = () => {
      if (!form.value.bookId) {
        errors.value.bookId = 'Book is required'
      } else {
        errors.value.bookId = ''
      }
    }

    const validateReaderName = () => {
      if (form.value.readerName.trim().length === 0) {
        errors.value.readerName = 'Reader name is required'
      } else {
        errors.value.readerName = ''
      }
    }

    const isFormValid = computed(() => {
      return form.value.bookId && form.value.readerName.trim().length > 0
    })

    const save = async () => {
      if (!isFormValid.value) {
        toast.warning('Please fill all required fields')
        return
      }

      try {
        if (isEdit.value) {
          await updateRent(props.rent.id, form.value)
          toast.success('Rent updated successfully')
        } else {
          await createRent({ bookId: form.value.bookId, readerName: form.value.readerName })
          toast.success('Rent created successfully')
        }
        emit('saved')
      } catch (error) {
        console.error('Error saving rent:', error)
        toast.error(error.displayMessage || 'Error saving rent')
      }
    }

    const close = () => {
      emit('close')
    }

    return { form, isEdit, errors, isFormValid, validateBookId, validateReaderName, save, close }
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