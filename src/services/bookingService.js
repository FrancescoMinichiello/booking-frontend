import axios from 'axios';

const apiClient = axios.create({
    baseURL: 'http://127.0.0.1:8000/api',
    headers: {
        'Content-Type': 'application/json'
    }
});

export default {
    getBookings() {
        return apiClient.get('/bookings');
    },
    createBooking(booking) {
        return apiClient.post('/bookings', booking);
    },
    deleteBooking(id) {
        return apiClient.delete(`/bookings/${id}`);
    }
};
