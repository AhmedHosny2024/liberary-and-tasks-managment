<template>
  <div :class="`${bg} p-6 rounded-lg shadow-md flex flex-col justify-between h-ful `">
      <div class="flex flex-row mb-4 w-full justify-between items-baseline">
        <h2 class="text-2xl font-bold">{{ cart.title }}</h2>
        <div class="flex justify-between items-center min-w-fit gap-4 ml-4">
          <span :class="`text-black text-md  rounded-full bg-white py-1 px-3`">{{ cart.priority }}</span>
          <CartActions :cart="cart" />
        </div>
      </div>
      <span class="text-gray-500 text-md">{{ cart.dueDate }}</span>
      <p class="mt-2 mb-4">
        {{ cart.description }}
      </p>
      <div class="flex justify-between items-center">
        <div
          :class="`inline-block ${tg} text-white rounded-lg px-4 py-2 `"
        >
          {{ cart.status }}
        </div>
        <div
          v-if="cart.status === 'todo'"
          class="inline-block bg-black text-white rounded-lg px-4 py-2 hover:bg-gray-700 cursor-pointer"
        @click="markCompleted(cart.id)"
        >
          Mark as Completed
        </div>
      </div>
  </div>
</template>


<script setup>
import CartActions from './CartActions.vue'
import {defineProps} from 'vue'
import axios from 'axios'
const emit = defineEmits(['close'])

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
const bg = props.cart.status === 'completed' ? 'bg-green-200' : 'bg-red-200'
const tg = props.cart.status === 'completed' ? 'bg-green-500' : 'bg-red-500'

const markCompleted = async (id) => {
  await axios.put(`/api/tasks/${id}`, { status: 'completed' })
  emit('markCompleted')
}
</script>