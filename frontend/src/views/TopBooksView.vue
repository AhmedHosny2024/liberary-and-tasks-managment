<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold mb-8 text-gray-800">📚 Top 5 Borrowed Books</h1>

    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      <div
        v-for="book in books"
        :key="book.book_id"
        class="bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-lg transition-shadow duration-300 p-6"
      >
        <h2 class="text-xl font-semibold text-gray-700 mb-2 truncate">
          {{ book.title }}
        </h2>

        <p class="text-sm text-gray-600 mb-1">
          👤 Author:
          <span class="font-medium">{{ book.author || 'Unknown' }}</span>
        </p>

        <p class="text-sm text-gray-600 mb-3">
          📅 Published:
          <span class="font-medium">
            {{ formatDate(book.publishedDate) }}
          </span>
        </p>

        <div
          class="text-sm text-gray-800 bg-blue-50 border border-blue-200 inline-block px-4 py-1 rounded-full mt-auto"
        >
          🔁 Borrowed {{ book.borrow_count }} times
        </div>
      </div>
    </div>
  </div>
</template>


<script setup>

import { ref, onMounted } from 'vue'
import axiosInstant from '../server/server.js'

const books = ref([])

const fetchBooks = async () => {
  try {
    const response = await axiosInstant.get('loans/top-borrowed')
    books.value = response.data
  } catch (error) {
    console.error('Error fetching top books:', error)
  }
}

const formatDate = (dateStr) => {
  const options = { year: 'numeric', month: 'short', day: 'numeric' }
  return new Date(dateStr).toLocaleDateString(undefined, options)
}

onMounted(() => {
  fetchBooks()
})

</script>