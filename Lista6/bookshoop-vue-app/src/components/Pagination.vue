<template>
  <div class="pagination" v-if="totalPages > 1">
    <button @click="prevPage" :disabled="currentPage === 0" class="btn">Previous</button>
    <span>Page {{ currentPage + 1 }} of {{ totalPages }}</span>
    <button @click="nextPage" :disabled="currentPage >= totalPages - 1" class="btn">Next</button>
  </div>
</template>

<script>
/* eslint-disable vue/multi-word-component-names */
export default {
  name: 'Pagination',
  props: {
    currentPage: Number,
    totalPages: Number
  },
  emits: ['page-changed'],
  setup(props, { emit }) {
    const prevPage = () => {
      if (props.currentPage > 0) {
        emit('page-changed', props.currentPage - 1)
      }
    }

    const nextPage = () => {
      if (props.currentPage < props.totalPages - 1) {
        emit('page-changed', props.currentPage + 1)
      }
    }

    return { prevPage, nextPage }
  }
}
</script>

<style scoped>
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  margin: 1rem 0;
}

.btn {
  background-color: #007bff;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
}

.btn:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.btn:hover:not(:disabled) {
  background-color: #0056b3;
}
</style>