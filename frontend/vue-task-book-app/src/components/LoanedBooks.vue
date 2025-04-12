<template>
  <div>
    <h2 class="text-xl font-bold mb-4">Loaned Books</h2>
    <ul>
      <li v-for="entry in books" :key="entry.loan_id" class="p-2 border-b">
        <p><strong>{{ entry.book.title }}</strong> by {{ entry.book.author }}</p>
        <p>Borrowed by: {{ entry.user.name }} ({{ entry.user.email }})</p>
        <p>Return Date: {{ entry.returnDate }}</p>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
// import axios from 'axios'

const books = ref([])

onMounted(async () => {
  // const res = await axios.get('/api/loaned-books')
  // books.value = res.data
  books.value = [
    {
        "loan_id": 1,
        "borrowed_at": "2025-04-07T01:40:52.415Z",
        "returnDate": "2025-04-07T15:33:27.000Z",
        "user": {
            "user_id": 3,
            "name": "Greg Stanton",
            "email": "Demarcus.Lemke12@gmail.com",
            "created_at": "2025-04-11T16:48:54.269Z"
        },
        "book": {
            "book_id": 11,
            "title": "tamisium perferendis apostolus",
            "author": "Ms. Susie Crona",
            "publishedDate": "2024-08-28"
        }
    },
    {
        "loan_id": 2,
        "borrowed_at": "2025-04-02T00:14:19.127Z",
        "returnDate": "2025-04-03T11:47:53.000Z",
        "user": {
            "user_id": 6,
            "name": "Jessie Stokes",
            "email": "Nikita_Franey@gmail.com",
            "created_at": "2025-04-11T16:48:54.296Z"
        },
        "book": {
            "book_id": 15,
            "title": "audeo perspiciatis utilis",
            "author": "Lauren Cremin",
            "publishedDate": "2024-04-22"
        }
    },
  ]
})
</script>
