<template>
  <div class="flex flex-col p-4 ">
    <div class="flex justify-between  mt-2 flex-row md:mx-16 ">
      <div class=" text-lg md:text-xl container-xl lg:container my-auto font-semibold">Tasks List</div>
      <div class="flex items-center space-x-2 mx-2">
        <select class="border border-gray-300 rounded-lg p-2" v-model="statusFilter" @change="ChangeStatus(statusFilter)">
          <option value="">All</option>
          <option value="completed">Completed</option>
          <option value="todo">To Do</option>
        </select>
      </div>
      <button @click.prevent="openModel" class="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 min-w-fit">
        New Task
      </button>
    </div>
    <section class="pb-4 pt-2">
      <div class="container-xl lg:container m-auto">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-col-3 gap-4 p-4 rounded-lg">
          <TaskCard
            v-for="task in tasks"
            :key="task?.id + task.status"
            :cart=task
            class="mb-4"
            @updateTaskStatus="fetchTasks"
          />
        </div>
      </div>
    </section>
    
    <div class="flex justify-center mt-4">
      <button
        v-for="(page, index) in paginationPages"
        :key="index"
        @click="typeof page === 'number' && changePage(page)"
        :disabled="page === '...'"
        :class="[
          'px-4 py-2 mx-1 rounded',
          page === currentPage ? 'bg-blue-500 text-white' : 'bg-gray-200',
          page === '...' ? 'cursor-default text-gray-500' : ''
        ]"
      >
        {{ page }}
      </button>
    </div>

    <TaskModal
      v-if="addNewTask"
      @close="handleModalClose"
      :disableEdit="false" 
      :key="addNewTask"
      :newTask="true"
    />

  </div>
</template>

<script setup>
import TaskCard from './TaskCard.vue'
import TaskModal from './TaskModal.vue'
import { ref, onMounted } from 'vue'
import axiosInstant from '../server/server.js'
import { useStore } from '../stores/store'
import { computed } from 'vue'

const taskStore = useStore()
const tasks = computed(() => taskStore.tasks)
const addNewTask = ref(false)
const pagesize = ref(0)
const limit = ref(5)
const currentPage = ref(1)
const statusFilter = ref('')

function ChangeStatus (status) {
  statusFilter.value = status
  currentPage.value = 1
  fetchTasks()
}

function ChangePage (page) {
  currentPage.value = page
  fetchTasks()
}

function handleModalClose() {
  addNewTask.value = false
}
function openModel() {
  addNewTask.value = true
}


const fetchTasks = async () => {
  try {
    const response = await axiosInstant.get(`tasks?page=${currentPage.value}&limit=${limit.value}&status=${statusFilter.value}`)
    // tasks.value = response.data.data
    pagesize.value = response.data.total / limit.value
    taskStore.setTasks(response.data.data)

  } catch (error) {
    console.error('Error fetching tasks:', error)
  }
}


const paginationPages = computed(() => {
  const total = Math.ceil(pagesize.value)
  const current = currentPage.value
  const pages = []

  if (total <= 10) {
    for (let i = 1; i <= total; i++) pages.push(i)
  } else {
    pages.push(1)
    if (current > 4) pages.push('...')

    const start = Math.max(2, current - 1)
    const end = Math.min(total - 1, current + 1)

    for (let i = start; i <= end; i++) pages.push(i)

    if (current < total - 3) pages.push('...')
    pages.push(total)
  }

  return pages
})

onMounted(fetchTasks)
</script>
