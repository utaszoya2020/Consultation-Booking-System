import { get } from './axios';

const API_BOOKING_URL = './bookings';
const API_USER_URL = './users';

export const fetchAllMyBookings = (userId) => {
    const url = `${API_USER_URL}/${userId}/bookings`;
    const data = {
        userId,
    };
    return get(url, data).then((response) => response.data);
};
