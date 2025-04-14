<template>
  <div class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-30" @click="handleOutsideClick">
    <div class="bg-white p-6 rounded-lg shadow-lg w-[40rem]" @click.stop>
      <h3 class="text-xl mb-4 font-semibold">Loan details</h3>

      <form @submit.prevent="submitLoan">

        <div class="mb-4">
          <label for="book" class="block text-sm font-medium text-gray-700">Book Name</label>
          <select v-model="editableLoan.book.id" id="book" class="w-full p-2 mt-1 border border-gray-300 rounded" required :disabled="disableEdit">
            <option disabled value="">Select a book</option>
            <option v-for="book in books" :key="book.id" :value="book.id">
              {{ book.title }}
            </option>
          </select>
        </div>

        <div class="mb-4">
          <label for="user" class="block text-sm font-medium text-gray-700">User Name</label>
          <select v-model="editableLoan.user.id" id="user" class="w-full p-2 mt-1 border border-gray-300 rounded" required :disabled="disableEdit">
            <option disabled value="">Select a user</option>
            <option v-for="user in users" :key="user.id" :value="user.id">
              {{ user.name }}
            </option>
          </select>
        </div>

        <div class="mb-4">
          <label for="returnDate" class="block text-sm font-medium text-gray-700">Return Date</label>
          <input v-model="formattedReturnDate" :min="today" id="returnDate" type="date" class="w-full p-2 mt-1 border border-gray-300 rounded" required :readonly="disableEdit"/>
        </div>

        <div class="flex justify-end space-x-2">
          <button @click="closeEditModal" type="button" class="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400">Cancel</button>
          <button v-if="!disableEdit" type="submit" class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">Submit</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import axiosInstant from '../server/server.js'
import { useStore } from '../stores/store.js'

const props = defineProps({
  disableEdit: {
    type: Boolean,
    default: false
  },
  open: {
    type: Boolean,
    default: false
  },
  newLoan: {
    type: Boolean,
    default: false
  },
  loan: {
    type: Object,
    required: false
  }
})

const loanStore = useStore()

const emit = defineEmits(['close'])

const today = new Date().toISOString().split('T')[0]

const editableLoan = ref({...props.loan })
if(!props.loan){
  editableLoan.value = {
    book: {
      id: "",
    },
    user: {
      id: "",
    },
    returnDate: today
  }
}

const opened = ref(props.open)

const users = ref([])
const books = ref([])


const formattedReturnDate = computed({
  get() {
    console.log('Getting returnDate:', editableLoan.value.returnDate)
    return editableLoan.value.returnDate
      ? editableLoan.value.returnDate.split('T')[0]
      : ''
  },
  set(value) {
    console.log('Setting returnDate:', value)
    editableLoan.value.returnDate = value
  }
})

const closeEditModal = () => {
  emit('close')
}

const handleOutsideClick = (event) => {
  const modalElement = event.target.closest('.bg-white')
  if (!modalElement) closeEditModal()
}

const fetchUsersAndBooks = async () => {
  try {
    const [userRes, bookRes] = await Promise.all([
    axiosInstant.get('/users'),
    axiosInstant.get('/books')
    ])
    users.value = userRes.data
    books.value = bookRes.data
  } catch (err) {
    console.error('Failed to fetch users or books:', err)
  }
}

const submitLoan = async () => {
  try {
    console.log('Submitting loan:', editableLoan.value, returnDate.value)
    const loanData = {
      book_id: editableLoan.value.book.id,
      user_id: editableLoan.value.user.id,
      returnDate: editableLoan.value.returnDate,
    }
    if(props.newLoan) {
      const response = await axiosInstant.post('loans', loanData)
      if (response.status === 201 || response.status === 200) {
        loanStore.addLoan(response.data)
      } else {
        console.error('Failed to create new loan:', response.statusText)
      }
    } else {
      const response = await axiosInstant.patch(`loans/${props.loan.loan_id}`, loanData)
      if (response.status === 200) {

        editableLoan.value = {...response.data}
        
        Object.assign(props.loan, {...editableLoan.value})
        
        console.log('Updated loan:', props.loan)
        console.log('Updated response:', editableLoan.value)

        loanStore.updateLoan(props.loan.loan_id,response.data)
      } else {
        console.error('Failed to update loan:', response.statusText)
      }
    }
  } catch (error) {
    console.error('Error creating loan:', error)
  }
  finally {
    closeEditModal()
  }
}

onMounted(fetchUsersAndBooks)
</script>
