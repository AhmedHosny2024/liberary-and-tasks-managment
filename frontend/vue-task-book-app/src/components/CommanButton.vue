<template>
  <div
    :class="`inline-block ${bg} text-white rounded-lg px-4 py-2 hover:bg-gray-700`"
    @click="onClick"
  >
    {{ label }}
  </div>
</template>

<script setup>
import { defineProps } from 'vue'

defineProps({
  label: {
    type: String,
    required: true
  },
  onClick: {
    type: Function,
    required: true
  },
  bg: {
    type: String,
    required: true
  }
})
</script>