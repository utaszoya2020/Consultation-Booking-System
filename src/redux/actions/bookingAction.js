import {
    FETCH_BOOKING_ACTION,
    FETCH_BOOKING_SUCCESS,
    FETCH_BOOKING_FAILURE,
    ADD_BOOKING_ACTION,
    ADD_BOOKING_SUCCESS,
    ADD_BOOKING_FAILURE,
    FETCH_BOOKING_DETAIL_SUCCESS,
} from './action.js';

import {
    fetchAllMyBookings,
    fetchAllBookings,
    fetchBookingDetail,
    addBooking,
    updateBookingStatus,
} from '../../utils/api/booking';

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

export const fetchBookingDetailSuccess = (bookingDetail) => ({
    bookingDetail,
    type: FETCH_BOOKING_DETAIL_SUCCESS,
});

// Fetch Booking Detail
export const fetchBookingDetailThunkAction = (bookingId) => (dispatch) => {
    dispatch(fetchBookingAction());
    fetchBookingDetail(bookingId)
        .then((data) => {
            dispatch(fetchBookingDetailSuccess(data));
        })
        .catch((error) => {
            console.log(error);
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
    bookingTime,
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
        bookingTime,
        attachment
    )
        .then((data) => {
            dispatch(addBookingSuccess(data));
        })
        .catch((error) => {
            dispatch(addBookingFailure(error));
        });
};

export const updateStatusThunkAction = (currentBookingId, status) => (
    dispatch
) => {
    updateBookingStatus(currentBookingId, status)
        .then((data) => {
            dispatch(fetchBookingDetailSuccess(data));
        })
        .catch((error) => {
            console.log(error);
            dispatch(fetchBookingFailure(error));
        });
};
