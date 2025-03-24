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
    <div class="bookings-container">
        <h1 class="title">Prenotazioni</h1>

        <form @submit.prevent="addBooking" class="booking-form">
            <input v-model="newBooking.customer_name" placeholder="Nome Cliente" class="input-field" />
            <span v-if="v$.customer_name.$error" class="error-message">Il nome è obbligatorio.</span>

            <input v-model="newBooking.customer_email" type="email" placeholder="Email Cliente" class="input-field" />
            <span v-if="v$.customer_email.$error" class="error-message">Inserisci un'email valida.</span>

            <input v-model="newBooking.booking_time" type="datetime-local" class="input-field" />
            <span v-if="v$.booking_time.$error" class="error-message">Seleziona una data e ora.</span>

            <button type="submit" class="submit-button">Aggiungi Prenotazione</button>
        </form>

        <ul class="bookings-list">
            <li v-for="booking in bookings" :key="booking.id" class="booking-item">
                <span class="booking-info">{{ booking.customer_name }} - {{ booking.booking_time }}</span>
                <button @click="deleteBooking(booking.id)" class="delete-button">Elimina</button>
            </li>
        </ul>
    </div>
</template>

<style scoped>
.bookings-container {
    max-width: 600px;
    margin: 0 auto;
    padding: 20px;
    background-color: #f9f9f9;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.title {
    text-align: center;
    font-size: 2rem;
    margin-bottom: 20px;
    color: #333;
}

.booking-form {
    display: flex;
    flex-direction: column;
    gap: 15px;
}

.input-field {
    padding: 10px;
    font-size: 1rem;
    border: 1px solid #ddd;
    border-radius: 4px;
    outline: none;
}

.input-field:focus {
    border-color: #007bff;
}

.submit-button {
    padding: 12px;
    font-size: 1rem;
    background-color: #28a745;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
}

.submit-button:hover {
    background-color: #218838;
}

.error-message {
    color: #dc3545;
    font-size: 0.9rem;
}

.bookings-list {
    list-style-type: none;
    padding: 0;
    margin-top: 30px;
}

.booking-item {
    display: flex;
    justify-content: space-between;
    padding: 12px;
    background-color: #fff;
    margin-bottom: 10px;
    border-radius: 6px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.booking-info {
    font-size: 1.1rem;
    color: #333;
}

.delete-button {
    padding: 6px 12px;
    background-color: #dc3545;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
}

.delete-button:hover {
    background-color: #c82333;
}
</style>