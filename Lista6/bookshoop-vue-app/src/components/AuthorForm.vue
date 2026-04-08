<template>
  <div class="modal-overlay" @click="close">
    <div class="modal" @click.stop>
      <h3>{{ isEdit ? 'Edit Author' : 'Add Author' }}</h3>
      <form @submit.prevent="save">
        <div class="form-group">
          <label for="name">Name:</label>
          <input id="name" v-model="form.name" @blur="validateName" />
          <p v-if="errors.name" class="error-message">{{ errors.name }}</p>
        </div>
        <div class="form-group">
          <label for="surname">Surname:</label>
          <input id="surname" v-model="form.surname" @blur="validateSurname" />
          <p v-if="errors.surname" class="error-message">{{ errors.surname }}</p>
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
import { createAuthor, updateAuthor } from '../services/api'
import { useToast } from 'vue-toastification'

export default {
  name: 'AuthorForm',
  props: {
    author: Object
  },
  emits: ['close', 'saved'],
  setup(props, { emit }) {
    const form = ref({ name: '', surname: '' })
    const isEdit = ref(false)
    const errors = ref({ name: '', surname: '' })
    const toast = useToast()

    watch(() => props.author, (newAuthor) => {
      if (newAuthor) {
        form.value = { ...newAuthor }
        isEdit.value = true
      } else {
        form.value = { name: '', surname: '' }
        isEdit.value = false
      }
      errors.value = { name: '', surname: '' }
    }, { immediate: true })

    const validateName = () => {
      if (form.value.name.trim().length < 2) {
        errors.value.name = 'Name must be at least 2 characters'
      } else {
        errors.value.name = ''
      }
    }

    const validateSurname = () => {
      if (form.value.surname.trim().length < 2) {
        errors.value.surname = 'Surname must be at least 2 characters'
      } else {
        errors.value.surname = ''
      }
    }

    const isFormValid = computed(() => {
      return form.value.name.trim().length >= 2 && form.value.surname.trim().length >= 2
    })

    const save = async () => {
      validateName()
      validateSurname()

      if (!isFormValid.value) {
        toast.warning('Please fill all fields correctly')
        return
      }

      const payload = {
        name: form.value.name.trim(),
        surname: form.value.surname.trim()
      }

      try {
        if (isEdit.value) {
          await updateAuthor(props.author.id, payload)
          toast.success('Author updated successfully')
        } else {
          await createAuthor(payload)
          toast.success('Author created successfully')
        }
        emit('saved')
      } catch (error) {
        console.error('Error saving author:', error)
        toast.error(error.displayMessage || 'Error saving author')
      }
    }

    const close = () => {
      emit('close')
    }

    return { form, isEdit, errors, isFormValid, validateName, validateSurname, save, close }
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

input {
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