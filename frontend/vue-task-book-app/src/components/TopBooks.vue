<template>
  <div>
    <h2 class="text-xl font-bold mb-4">Top 5 Books</h2>
    <ol>
      <li v-for="book in topBooks" :key="book.book_id" class="p-2 border-b">
        {{ book.title }} — borrowed {{ book.borrow_count }} times
      </li>
    </ol>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
// import axios from 'axios'

const topBooks = ref([])

onMounted(async () => {
  // const res = await axios.get('/api/top-books')
  // topBooks.value = res.data
  topBooks.value = [
    {
        "book_id": 11,
        "title": "tamisium perferendis apostolus",
        "borrow_count": "2"
    },
    {
        "book_id": 15,
        "title": "audeo perspiciatis utilis",
        "borrow_count": "1"
    },
    {
        "book_id": 3,
        "title": "cauda quo caecus",
        "borrow_count": "1"
    },
    {
        "book_id": 16,
        "title": "terreo tibi delicate",
        "borrow_count": "1"
    },
    {
        "book_id": 10,
        "title": "debitis thymbra tero",
        "borrow_count": "1"
    }
]
})
</script>
