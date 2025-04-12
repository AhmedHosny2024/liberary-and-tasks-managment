<template>
  <form @submit.prevent="addTask" class="space-y-2">
    <input v-model="title" placeholder="Title" class="w-full p-2 border rounded" />
    <textarea v-model="description" placeholder="Description" class="w-full p-2 border rounded"></textarea>
    <input type="date" v-model="dueDate" class="w-full p-2 border rounded" />
    <input type="number" v-model="priority" placeholder="Priority (1-5)" class="w-full p-2 border rounded" />
    <button type="submit" class="bg-blue-600 text-white px-4 py-2 rounded">Add Task</button>
  </form>
</template>

<script setup>
import { ref } from 'vue'
import axios from 'axios'

const title = ref('')
const description = ref('')
const dueDate = ref('')
const priority = ref(1)

const addTask = async () => {
  await axios.post('/api/tasks', {
    title: title.value,
    description: description.value,
    dueDate: dueDate.value,
    priority: priority.value,
    status: 'todo',
  })
  title.value = description.value = dueDate.value = ''
  priority.value = 1
}
</script>
