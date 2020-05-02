import {
    FETCH_BOOKING_ACTION,
    FETCH_BOOKING_SUCCESS,
    FETCH_BOOKING_FAILURE,
    ADD_BOOKING_ACTION,
    ADD_BOOKING_SUCCESS,
    ADD_BOOKING_FAILURE,
} from './action.js';
import { addBooking } from '../../utils/api/booking';

import { fetchAllMyBookings, fetchAllBookings } from '../../utils/api/booking';

export const fetchBookingAction = () => ({
    type: FETCH_BOOKING_ACTION,
});

export const fetchBookingSuccess = (bookings) => ({
    bookings,
    type: FETCH_BOOKING_SUCCESS,
});

export const fetchBookingFailure = (error) => ({
    error,
    type: FETCH_BOOKING_FAILURE,
});

export const fetchBookingThunkAction = (userId) => (dispatch) => {
    dispatch(fetchBookingAction());
    fetchAllMyBookings(userId)
        .then((data) => {
            dispatch(fetchBookingSuccess(data));
        })
        .catch((error) => {
            dispatch(fetchBookingFailure(error));
        });
};
// Fetch All Booking -- Admin
export const fetchAllBookingThunkAction = () => (dispatch) => {
    dispatch(fetchBookingAction());
    fetchAllBookings()
        .then((data) => {
            dispatch(fetchBookingSuccess(data));
        })
        .catch((error) => {
            dispatch(fetchBookingFailure(error));
        });
};

// Add Booking
export const addBookingAction = () => ({
    type: ADD_BOOKING_ACTION,
});

export const addBookingSuccess = (newBooking) => ({
    newBooking,
    type: ADD_BOOKING_SUCCESS,
});

export const addBookingFailure = (error) => ({
    error,
    type: ADD_BOOKING_FAILURE,
});

export const addBookingThunkAction = (
           type,
           campus,
           userId,
           topic,
           subject,
           content,
           bookingDate,
           attachment
       ) => (dispatch) => {
           dispatch(addBookingAction());
           addBooking(
               type,
               campus,
               userId,
               topic,
               subject,
               content,
               bookingDate,
               attachment
           )
               .then((data) => {
                   console.log(data);
                   dispatch(addBookingSuccess(data));
               })
               .catch((error) => {
                   dispatch(addBookingFailure(error));
               });
       };
