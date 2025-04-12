<template>
  <div class="flex justify-between items-center z-20">
    <div class="relative">
      <button @click="toggleMenu" class="flex flex-col items-center space-y-1">
        <span class="block w-1 h-1 bg-gray-500 rounded-full"></span>
        <span class="block w-1 h-1 bg-gray-500 rounded-full"></span>
        <span class="block w-1 h-1 bg-gray-500 rounded-full"></span>
      </button>

      <div v-if="menuOpen" class="absolute right-0 bg-white border border-gray-300 rounded-lg shadow-lg w-max mt-2 z-10">
        <ul class="text-sm">
          <li @click="viewCart" class="px-4 py-2 cursor-pointer hover:bg-gray-100">View</li>
          <li @click="editCart" class="px-4 py-2 cursor-pointer hover:bg-gray-100" v-if="cart.status!=='completed'">Edit</li>
          <li @click="deleteTask" class="px-4 py-2 cursor-pointer hover:bg-red-500 hover:text-white">Delete</li>
        </ul>
      </div>
    </div>
  </div>


  <TaskModel
    v-if="isViewModalOpen"
    :cart="cart"
    @close="handleModalClose"
    :disableEdit="true" 
    :key="isViewModalOpen"
  />
  <TaskModel 
    v-else-if="isEditModalOpen" 
    :cart="cart" 
    @close="handleModalClose"
    :disableEdit="false"
    :key="isEditModalOpen"
  />

</template>

<script setup>
import TaskModel from './TaskModel.vue'
import { ref } from 'vue'
import axiosInstant from '../server/server.js'
import { useTaskStore } from '../stores/taskStore'

const props = defineProps({
  cart: {
    type: Object,
    required: true
  },
})

const menuOpen = ref(false)
const isEditModalOpen = ref(false)
const isViewModalOpen = ref(false)
const taskStore = useTaskStore()


function toggleMenu() {
  menuOpen.value = !menuOpen.value
}

function viewCart() {
  isViewModalOpen.value = true
  menuOpen.value = false
}

const deleteTask = async () => {
  try {
    const res = await axiosInstant.delete(`tasks/${props.cart.id}`)
    if (res.status === 200) {
      menuOpen.value = false
      taskStore.removeTask(props.cart.id)
    } else {
      console.error('Failed to delete task')
    }
  } catch (error) {
    console.error('Error deleting task:', error)
  }
}

function editCart() {
  isEditModalOpen.value = true
  menuOpen.value = false
}


function handleModalClose() {
  isViewModalOpen.value = false
  isEditModalOpen.value = false
}
</script>
