import { createRouter, createWebHistory } from 'vue-router'
import TasksView from '@/views/TasksView.vue'
import LibraryView from '@/views/LibraryView.vue'
import TopBooksView from '@/views/TopBooksView.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'tasks',
      component: TasksView
    },
    {
      path: '/library',
      name: 'library',
      component: LibraryView
    },
    {
      path: '/library/top-books',
      name: 'top-books',
      component: TopBooksView
    }
  ]
});

export default router