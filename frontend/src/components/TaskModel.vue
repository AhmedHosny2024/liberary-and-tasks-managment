<template>
    <div class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-30 " @click="handleOutsideClick">
    <div class="bg-white p-6 rounded-lg shadow-lg w-[45rem]" @click.stop>
      <h3 class="text-xl mb-4 font-semibold">Task details</h3>

      <form @submit.prevent="updateCart">
        <div class="mb-4">
          <label for="title" class="block text-sm font-medium text-gray-700">Title</label>
          <input v-model="editableCart.title" id="title" type="text" class="w-full p-2 mt-1 border border-gray-300 rounded" :readonly="disableEdit"  required/>
        </div>
        <div class="mb-4">
          <label for="priority" class="block text-sm font-medium text-gray-700">Priority</label>
          <input v-model="editableCart.priority" id="priority" type="number" min="1" max="5" class="w-full p-2 mt-1 border border-gray-300 rounded" :readonly="disableEdit" required/>
        </div>
        <div class="mb-4">
          <label for="description" class="block text-sm font-medium text-gray-700">Description</label>
          <textarea v-model="editableCart.description" id="description" class="w-full p-2 mt-1 border border-gray-300 rounded" rows="4" :readonly="disableEdit" required></textarea>
        </div>
        <div class="mb-4">
          <label for="status" class="block text-sm font-medium text-gray-700">Status</label>
          <select
            v-model="editableCart.status"
            id="status"
            class="w-full p-2 mt-1 border border-gray-300 rounded"
            :disabled="disableEdit"
            required
          >
            <option value="todo">To Do</option>
            <option value="completed">Completed</option>
          </select>
        </div>
        <div class="mb-4">
          <label for="dueDate" class="block text-sm font-medium text-gray-700">Due Date</label>
          <input v-model="editableCart.dueDate" :min="today" id="dueDate" type="date" class="w-full p-2 mt-1 border border-gray-300 rounded" :readonly="disableEdit" required/>
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
import axiosInstant from '../server/server.js'
import { useTaskStore } from '../stores/taskStore'

const props = defineProps({
  cart: {
    type: Object,
    required: false
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
const taskStore = useTaskStore()

const emit = defineEmits(['close'])
const opened = ref(props.open) 
const editableCart = ref({ ...props.cart })
const disableEdit = ref(props.disableEdit) 
const today = new Date().toISOString().split('T')[0] 

function closeEditModal() {
  opened.value = false
  console.log(disableEdit)
  emit('close')
}
function handleOutsideClick(event) {
  const modalElement = event.target.closest('.bg-white')
  if (!modalElement) {
    closeEditModal() 
  }
}

const updateCart=async () => {
  if(props.newTask){
    console.log('New task data:', editableCart.value)
    try {
      const response = await axiosInstant.post('tasks', editableCart.value)
      if (response.status === 201 || response.status === 200) {
        console.log('New task created successfully:', response.data)
        taskStore.addTask(response.data)
      } else {
        console.error('Failed to create new task:', response.statusText)
      }
    } catch (error) {
      console.error('Error creating new task:', error)
    }
  } else {
    console.log('Updated task data:', editableCart.value)
    try {
      const response = await axiosInstant.patch(`tasks/${props.cart.id}`, editableCart.value)
      if (response.status === 200) {
        console.log('Task updated successfully:', response.data)
        Object.assign(props.cart, editableCart.value)
        taskStore.updateTask(props.cart.id,response.data)
      } else {
        console.error('Failed to update task:', response.statusText)
      }
    } catch (error) {
      console.error('Error updating task:', error)
    }
  }
  closeEditModal()

}

</script>