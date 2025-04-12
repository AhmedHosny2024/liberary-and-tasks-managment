import { defineStore } from 'pinia'

export const useTaskStore = defineStore('taskStore', {
  state: () => ({
    tasks: [],
  }),
  actions: {
    setTasks(newTasks) {
      this.tasks = newTasks
    },
    updateTask(id, updatedData) {
      const index = this.tasks.findIndex(t => t.id === id)
      if (index !== -1) {
        this.tasks[index] = { ...this.tasks[index], ...updatedData }
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
  },
})
