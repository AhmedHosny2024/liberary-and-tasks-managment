<template>
    <div class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-30 " @click="handleOutsideClick">
    <div class="bg-white p-6 rounded-lg shadow-lg w-[45rem]" @click.stop>
      <h3 class="text-xl mb-4 font-semibold">Task details</h3>

      <!-- Form to edit cart data -->
      <form @submit.prevent="updateCart">
        <div class="mb-4">
          <label for="title" class="block text-sm font-medium text-gray-700">Title</label>
          <input v-model="editableCart.title" id="title" type="text" class="w-full p-2 mt-1 border border-gray-300 rounded" :readonly="disableEdit"  />
        </div>
        <div class="mb-4">
          <label for="priority" class="block text-sm font-medium text-gray-700">Priority</label>
          <input v-model="editableCart.priority" id="priority" type="text" class="w-full p-2 mt-1 border border-gray-300 rounded" :readonly="disableEdit" />
        </div>
        <div class="mb-4">
          <label for="description" class="block text-sm font-medium text-gray-700">Description</label>
          <textarea v-model="editableCart.description" id="description" class="w-full p-2 mt-1 border border-gray-300 rounded" rows="4" :readonly="disableEdit" ></textarea>
        </div>
        <div class="mb-4">
          <label for="status" class="block text-sm font-medium text-gray-700">Status</label>
          <input v-model="editableCart.status" id="status" type="text" class="w-full p-2 mt-1 border border-gray-300 rounded" :readonly="disableEdit" />
        </div>
        <div class="mb-4">
          <label for="dueDate" class="block text-sm font-medium text-gray-700">Due Date</label>
          <input v-model="editableCart.dueDate" id="dueDate" type="date" class="w-full p-2 mt-1 border border-gray-300 rounded" :readonly="disableEdit" />
        </div>
        <div class="flex justify-end space-x-2">
          <button @click="closeEditModal" type="button" class="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400">Cancel</button>
          <button v-if="!disableEdit" type="submit" class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">Save</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
const props = defineProps({
  cart: {
    type: Object,
    required: true
  },
  disableEdit: {
    type: Boolean,
    default: false
  },
  open: {
    type: Boolean,
    default: false
  },
  newTask: {
    type: Boolean,
    default: false
  }
})
const emit = defineEmits(['close'])
const opened = ref(props.open) // State to control the modal visibility
const editableCart = ref({ ...props.cart }) // Create a copy of the cart for editing
const disableEdit = ref(props.disableEdit) // Disable edit mode if prop is true

function closeEditModal() {
  opened.value = false
  console.log(disableEdit)
  emit('close') // Emit close event to parent component
}
function handleOutsideClick(event) {
  const modalElement = event.target.closest('.bg-white')
  if (!modalElement) {
    closeEditModal() // Close the modal if click is outside
  }
}

function updateCart() {
  // Handle saving the updated cart
  if(props.newTask){
    // Logic to add a new task
    console.log('New task data:', editableCart.value)
  } else {
    // Logic to update an existing task
    console.log('Updated task data:', editableCart.value)
  }
  // You can emit the updated data or call a method to update the cart in a parent component
  closeEditModal()
}

</script>