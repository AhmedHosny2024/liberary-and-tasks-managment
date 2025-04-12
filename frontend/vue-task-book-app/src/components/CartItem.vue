<template>
  <div :class="`${bg} p-6 rounded-lg shadow-md`">
    <slot>
      <h2 class="text-2xl font-bold">{{ cart.title }}</h2>
      <p class="mt-2 mb-4">
        {{ cart.description }}
      </p>
      <div class="flex justify-between items-center">
        <div
          class="inline-block bg-black text-white rounded-lg px-4 py-2 hover:bg-gray-700"
        >
          {{ cart.status }}
        </div>
        <div
          v-if="cart.status === 'todo'"
          class="inline-block bg-black text-white rounded-lg px-4 py-2 hover:bg-gray-700"
        @click="markCompleted(cart.id)"
        >
          Mark as Completed
        </div>
      </div>
    </slot>
  </div>
</template>


<script setup>
import {defineProps} from 'vue'
import { onMounted } from 'vue'

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

onMounted(() => {
  console.log(props.cart)
})
</script>