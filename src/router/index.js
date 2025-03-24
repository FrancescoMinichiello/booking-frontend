import { createRouter, createWebHistory } from 'vue-router';
import BookingsView from '@/views/BookingsView.vue';  // Assicurati che il percorso sia corretto

const routes = [
    { path: '/', redirect: '/bookings' },
    { path: '/bookings', component: BookingsView }
];

const router = createRouter({
    history: createWebHistory(),
    routes
});

export default router;
