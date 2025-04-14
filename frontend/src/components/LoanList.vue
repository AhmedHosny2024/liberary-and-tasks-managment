<template>
  <div class="flex flex-col p-4">
    <div class="flex justify-between mt-2 flex-row md:mx-16">
      <div class="text-lg md:text-xl container-xl lg:container my-auto font-semibold">Loan List</div>
      <div class="flex items-center space-x-2 mx-2">
        <select
          class="border border-gray-300 rounded-lg p-2"
          v-model="statusFilter"
          @change="changeStatus(statusFilter)"
        >
          <option value="">All</option>
          <option :value="true">Returned</option>
          <option :value="false">Pending</option>
        </select>
      </div>
      <button @click.prevent="openModal" class="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 min-w-fit">
        New Loan
      </button>
    </div>

    <section class="pb-4 pt-2">
      <div class="container-xl lg:container m-auto">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4 rounded-lg">
          <LoanCard
            v-for="loan in loans"
            :key="loan?.loan_id + loan.returnDate +loan.isReturned"
            :loan="loan"
            class="mb-4"
            @updateLoanStatus="fetchLoans"
          />
        </div>
      </div>
    </section>

    <div class="flex justify-center mt-4">
      <button
        v-for="(page, index) in paginationPages"
        :key="index"
        @click="typeof page === 'number' && changePage(page)"
        :disabled="page === '...'"
        :class="[
          'px-4 py-2 mx-1 rounded',
          page === currentPage ? 'bg-blue-500 text-white' : 'bg-gray-200',
          page === '...' ? 'cursor-default text-gray-500' : ''
        ]"
      >
        {{ page }}
      </button>
    </div>


    <LoanModal
      v-if="showNewLoan"
      @close="handleModalClose"
      :disableEdit="false"
      :key="showNewLoan"
      :newLoan="true"
      @click.prevent="openModal"
    />
  </div>
</template>

<script setup>
import LoanCard from './LoanCard.vue'
import LoanModal from './LoanModal.vue'
import { ref, computed, onMounted } from 'vue'
import axiosInstant from '../server/server.js'
import { useStore } from '../stores/store'

const loanStore = useStore()
const loans = computed(() => loanStore.loans)
const showNewLoan = ref(false)
const pagesize = ref(0)
const limit = ref(10)
const currentPage = ref(1)
const statusFilter = ref('')

function changeStatus(status) {
  statusFilter.value = status
  currentPage.value = 1
  fetchLoans()
}

function changePage(page) {
  currentPage.value = page
  fetchLoans()
}

function handleModalClose() {
  showNewLoan.value = false
}

function openModal() {
  showNewLoan.value = true
}

const fetchLoans = async () => {
  try {
    const response = await axiosInstant.get(`loans?page=${currentPage.value}&limit=${limit.value}&isReturned=${statusFilter.value.toString()}`)
    pagesize.value = response.data.total / limit.value
    console.log(response.data.data)
    loanStore.setLoans(response.data.data)
  } catch (error) {
    console.error('Error fetching loans:', error)
  }
}

const paginationPages = computed(() => {
  const total = Math.ceil(pagesize.value)
  const current = currentPage.value
  const pages = []

  if (total <= 10) {
    for (let i = 1; i <= total; i++) pages.push(i)
  } else {
    pages.push(1)
    if (current > 4) pages.push('...')

    const start = Math.max(2, current - 1)
    const end = Math.min(total - 1, current + 1)

    for (let i = start; i <= end; i++) pages.push(i)

    if (current < total - 3) pages.push('...')
    pages.push(total)
  }

  return pages
})


onMounted(fetchLoans)
</script>
