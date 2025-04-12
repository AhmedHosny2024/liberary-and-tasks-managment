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
          <CartItem
            v-for="task in tasks"
            :key="task?.id + task.status"
            :cart=task
            class="mb-4"
            @updateTaskStatus="fetchTasks"
          />
        </div>
      </div>
    </section>
    
    <div class="flex justify-center mt-4 bottom-0">
      <button
        v-for="page in Math.ceil(pagesize)"
        :key="page"
        @click="ChangePage(page)"
        :class="`px-4 py-2 mx-1 rounded ${currentPage === page ? 'bg-blue-500 text-white' : 'bg-gray-200'}`"
      >
        {{ page }}
      </button>
    </div>

    <TaskModel
      v-if="addNewTask"
      @close="handleModalClose"
      :disableEdit="false" 
      :key="addNewTask"
      :newTask="true"
    />

  </div>
</template>

<script setup>
import CartItem from './CartItem.vue'
import TaskModel from './TaskModel.vue'
import { ref, onMounted } from 'vue'
import axiosInstant from '../server/server.js'
import { useTaskStore } from '../stores/taskStore'
import { computed } from 'vue'

const taskStore = useTaskStore()
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

onMounted(fetchTasks)
</script>
