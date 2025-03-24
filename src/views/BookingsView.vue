<script setup>
import { ref, onMounted } from 'vue';
import bookingService from '@/services/bookingService';

const bookings = ref([]);
const newBooking = ref({
    customer_name: '',
    customer_email: '',
    booking_time: ''
});

const fetchBookings = async () => {
    const response = await bookingService.getBookings();
    bookings.value = response.data;
};

const addBooking = async () => {
    await bookingService.createBooking(newBooking.value);
    newBooking.value = { customer_name: '', customer_email: '', booking_time: '' };
    fetchBookings();
};

const deleteBooking = async (id) => {
    await bookingService.deleteBooking(id);
    fetchBookings();
};

onMounted(fetchBookings);
</script>

<template>
    <div>
        <h1>Prenotazioni</h1>

        <form @submit.prevent="addBooking">
            <input v-model="newBooking.customer_name" placeholder="Nome Cliente" required />
            <input v-model="newBooking.customer_email" type="email" placeholder="Email Cliente" required />
            <input v-model="newBooking.booking_time" type="datetime-local" required />
            <button type="submit">Aggiungi Prenotazione</button>
        </form>

        <ul>
            <li v-for="booking in bookings" :key="booking.id">
                {{ booking.customer_name }} - {{ booking.booking_time }}
                <button @click="deleteBooking(booking.id)">Elimina</button>
            </li>
        </ul>
    </div>
</template>
