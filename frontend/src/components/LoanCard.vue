<template>
  <div :class="`${bg} p-6 rounded-lg shadow-md flex flex-col justify-between`">
    <div class="flex flex-row  w-full justify-between items-baseline">
      <h2 class="text-xl font-bold">{{ loan.book.title }}</h2>
      <div class="flex items-center gap-4 ml-4">
        <LoanActions :loan="loan" :key="loan.loan_id + loan.returnDate"/>
      </div>
    </div>

    <span class="text-black text-bold py-1 text-lg mb-4">
      {{ loan.user.name }}
    </span>

    <div class="flex flex-row  w-full justify-start gap-2 items-baseline mb-2">
      <span class="inline text-black text-md ">
        Return Date: 
      </span>
      <span class="inline text-gray-500 text-md ">
        {{ formattedReturnDate }}
      </span>
    </div>
    <div class="flex flex-row mb-4 w-full justify-start gap-2 items-baseline">
      <span class="inline text-black text-md mb-4">
        Author: 
      </span>
      <span class="inline text-gray-500 text-md mb-4">
        {{ loan.book.author }}
      </span>
    </div>

    <div class="flex justify-between items-center">
      <div :class="`inline-block ${tagColor} text-white rounded-lg px-4 py-2`">
        {{ loan.isReturned ? 'Completed' : 'Pending' }}
      </div>

      <div
        v-if="!loan.isReturned"
        class="inline-block bg-black text-white rounded-lg px-4 py-2 hover:bg-gray-700 cursor-pointer"
        @click="markReturned(loan.loan_id)"
      >
        Mark as Returned
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue'
import axiosInstant from '../server/server.js'
import LoanActions from './LoanActions.vue'
import { useTaskStore } from '../stores/taskStore' 

const props = defineProps({
  loan: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['updateLoanStatus'])
const loanStore = useTaskStore()

const bg = props.loan.isReturned ? 'bg-green-200' : 'bg-red-200'
const tagColor = props.loan.isReturned ? 'bg-green-500' : 'bg-red-500'

const formattedReturnDate = props.loan.returnDate?.split('T')[0] || ''

const markReturned = async (id) => {
  try {
    const response = await axiosInstant.patch(`/loans/${id}/return`)
    if (response.status === 200) {
      loanStore.updateLoanStatus(id, true)
      emit('updateLoanStatus')
    } else {
      console.error('Failed to mark loan as returned:', response.statusText)
    }
  } catch (error) {
    console.error('Error marking loan as returned:', error)
  }
}
</script>
