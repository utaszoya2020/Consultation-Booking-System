import { get, post } from './axios';

const API_BOOKING_URL = './bookings';
const API_USER_URL = './users';

export const fetchAllMyBookings = (userId) => {
    const url = `${API_USER_URL}/${userId}/bookings`;
    const data = {
        userId,
    };
    return get(url, data).then((response) => response.data);
};

export const addBooking = (
           type,
           campus,
           userId,
           topic,
           subject,
           content,
           bookingDate
       ) => {
           const url = API_BOOKING_URL;
           const data = {
               type,
               campus,
               userId,
               topic,
               subject,
               content,
               bookingDate
           };
           console.log(data);
           return post(url, data).then((response) => response.data);
       };
