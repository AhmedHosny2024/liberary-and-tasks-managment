import { defineStore } from 'pinia'

export const useStore = defineStore('MainStore', {
  state: () => ({
    tasks: [],
    loans: [],
  }),
  actions: {
    // Task actions
    setTasks(newTasks) {
      this.tasks = newTasks
    },
    updateTask(id, updatedData) {
      const index = this.tasks.findIndex(t => t.id === id)
      if (index !== -1) {
        const updatedTask = { ...this.tasks[index], ...updatedData }
        this.tasks.splice(index, 1, updatedTask)
      }
    },
    updateTaskStatus(id, status) {
      const index = this.tasks.findIndex(t => t.id === id)
      if (index !== -1) {
        this.tasks[index].status = status
      }
    },
    addTask(newTask) {
      this.tasks.push(newTask)
    },
    removeTask(id) {
      this.tasks = this.tasks.filter(t => t.id !== id)
    },

    // Loan actions
    setLoans(newLoans) {
      this.loans = newLoans
    },
    addLoan(newLoan) {
      this.loans.push(newLoan)
    },
    removeLoan(id) {
      console.log('removeLoan', id)
      const index = this.loans.findIndex(l => l.loan_id === id)
      if (index !== -1) {
        this.loans.splice(index, 1)
      }
    },
    updateLoan(id, updatedData) {
      const index = this.loans.findIndex(l => l.id === id)
      if (index !== -1) {
        const updatedLoan = { ...this.loans[index], ...updatedData }
        this.loans.splice(index, 1, updatedLoan)
      }
    },
    updateLoanStatus(id, status) {
      const index = this.loans.findIndex(l => l.id === id)
      if (index !== -1) {
        this.loans[index].isReturned = status
      }
    },

  },
})
