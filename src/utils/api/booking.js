import { get, post } from './axios';

const API_BOOKING_URL = './bookings';
const API_USER_URL = './users';

// TODO Fix REST API
export const fetchAllMyBookings = (userId) => {
    const url = `${API_USER_URL}/${userId}/bookings`;
    const data = {
        userId,
    };
    return get(url, data).then((response) => response.data);
};

export const fetchAllBookings = () => {
    const url = `${API_BOOKING_URL}`;
    return get(url).then((response) => response.data);
};

export const fetchBookingDetail = bookingId => {
    const url = `${API_BOOKING_URL}/${bookingId}`;
    return get(url).then((response) => response.data);
};

export const addBooking = (
           type,
           campus,
           userId,
           topic,
           subject,
           content,
           bookingDate,
           attachment
       ) => {
           const url = API_BOOKING_URL;
           const data = {
               type,
               campus,
               userId,
               topic,
               subject,
               content,
               bookingDate,
               attachment
           };
           console.log(data);
           return post(url, data).then((response) => response.data);
       };
