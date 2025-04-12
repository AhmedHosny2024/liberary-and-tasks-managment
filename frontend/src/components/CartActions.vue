<template>
  <div class="flex justify-between items-center z-20">
    <!-- 3 Dots Vertical Button -->
    <div class="relative">
      <button @click="toggleMenu" class="flex flex-col items-center space-y-1">
        <span class="block w-1 h-1 bg-gray-500 rounded-full"></span>
        <span class="block w-1 h-1 bg-gray-500 rounded-full"></span>
        <span class="block w-1 h-1 bg-gray-500 rounded-full"></span>
      </button>

      <!-- Menu -->
      <div v-if="menuOpen" class="absolute right-0 bg-white border border-gray-300 rounded-lg shadow-lg w-max mt-2 z-10">
        <ul class="text-sm">
          <li @click="viewCart" class="px-4 py-2 cursor-pointer hover:bg-gray-100">View</li>
          <li @click="editCart" class="px-4 py-2 cursor-pointer hover:bg-gray-100" v-if="cart.status!=='completed'">Edit</li>
          <li @click="deleteAll" class="px-4 py-2 cursor-pointer hover:bg-red-500 hover:text-white">Delete</li>
        </ul>
      </div>
    </div>
  </div>


  <!-- Modal for Editing Cart -->
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

// Props
const props = defineProps({
  cart: {
    type: Object,
    required: true
  },
  markCompleted: {
    type: Function,
    required: true
  }
})

// State
const menuOpen = ref(false)
const isEditModalOpen = ref(false)
const isViewModalOpen = ref(false)


// Methods
function toggleMenu() {
  menuOpen.value = !menuOpen.value
}

function viewCart() {
  isViewModalOpen.value = true
  menuOpen.value = false
}

function deleteAll() {
  // Handle delete all action
  console.log('Deleting all items')
  // Add logic for deleting all items in the cart
}

function editCart() {
  isEditModalOpen.value = true
  menuOpen.value = false
}

function handleModalClose() {
  // Handle the close event from TaskModel
  isViewModalOpen.value = false
  isEditModalOpen.value = false
}
</script>
