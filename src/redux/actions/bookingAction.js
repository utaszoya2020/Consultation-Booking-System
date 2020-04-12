import {
    FETCH_BOOKING_ACTION,
    FETCH_BOOKING_SUCCESS,
    FETCH_BOOKING_FAILURE,
} from './action.js';

import {fetchAllMyBookings} from '../../utils/api/booking';

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
