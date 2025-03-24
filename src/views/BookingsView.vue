<script setup>
import { ref, onMounted } from 'vue';
import { useVuelidate } from '@vuelidate/core';
import { required, email } from '@vuelidate/validators';
import bookingService from '@/services/bookingService';

const bookings = ref([]);
const newBooking = ref({
    customer_name: '',
    customer_email: '',
    booking_time: ''
});

// Regole di validazione
const rules = {
    customer_name: { required },
    customer_email: { required, email },
    booking_time: { required }
};

const v$ = useVuelidate(rules, newBooking);

const fetchBookings = async () => {
    const response = await bookingService.getBookings();
    bookings.value = response.data;
};

const addBooking = async () => {
    const isValid = await v$.value.$validate();
    if (!isValid) return;

    await bookingService.createBooking(newBooking.value);
    newBooking.value = { customer_name: '', customer_email: '', booking_time: '' };
    v$.value.$reset();
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
            <input v-model="newBooking.customer_name" placeholder="Nome Cliente" />
            <span v-if="v$.customer_name.$error">Il nome è obbligatorio.</span>

            <input v-model="newBooking.customer_email" type="email" placeholder="Email Cliente" />
            <span v-if="v$.customer_email.$error">Inserisci un'email valida.</span>

            <input v-model="newBooking.booking_time" type="datetime-local" />
            <span v-if="v$.booking_time.$error">Seleziona una data e ora.</span>

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
