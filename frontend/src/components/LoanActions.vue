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
          <li @click="viewLoan" class="px-4 py-2 cursor-pointer hover:bg-gray-100">View</li>
          <li v-if="!loan.isReturned" @click="editLoan" class="px-4 py-2 cursor-pointer hover:bg-gray-100">Edit</li>
          <li @click="deleteLoan" class="px-4 py-2 cursor-pointer hover:bg-red-500 hover:text-white">Delete</li>
        </ul>
      </div>
    </div>
  </div>

  <LoanModal
    v-if="isViewModalOpen"
    :loan="loan"
    @close="closeModal"
    :disableEdit="true"
    :key="'view-' + loan.id"
    :newLoan="false"
  />
  <LoanModal
    v-else-if="isEditModalOpen"
    :loan="loan"
    @close="closeModal"
    :disableEdit="false"
    :key="'edit-' + loan.id"
    :newLoan="false"
  />
</template>

<script setup>
import { ref } from 'vue'
import LoanModal from './LoanModal.vue'
import axiosInstant from '../server/server.js'
import { useTaskStore } from '../stores/taskStore'

const props = defineProps({
  loan: {
    type: Object,
    required: true
  }
})

const loan = ref(props.loan)
console.log(loan.value)

const menuOpen = ref(false)
const isViewModalOpen = ref(false)
const isEditModalOpen = ref(false)
const loanStore = useTaskStore()

function toggleMenu() {
  menuOpen.value = !menuOpen.value
}

function viewLoan() {
  isViewModalOpen.value = true
  menuOpen.value = false
}

function editLoan() {
  isEditModalOpen.value = true
  menuOpen.value = false
}

function closeModal() {
  isViewModalOpen.value = false
  isEditModalOpen.value = false
}

async function deleteLoan() {
  try {
    const res = await axiosInstant.delete(`/loans/${props.loan.loan_id}`)
    if (res.status === 200) {
      menuOpen.value = false
      loanStore.removeLoan(props.loan.loan_id)
    } else {
      console.error('Failed to delete loan')
    }
  } catch (error) {
    console.error('Error deleting loan:', error)
  }
}
</script>
