import {
    FETCH_BOOKING_ACTION,
    FETCH_BOOKING_SUCCESS,
    FETCH_BOOKING_FAILURE,
} from '../actions/action.js';

const initialState = {
    bookings: [],
    isLoading: false,
    error: null,
};

const bookingReducer = (state = initialState, action) => {
    switch (action.type) {
        case FETCH_BOOKING_ACTION: {
            return {
                ...state,
                isLoading: true,
            };
        }

        case FETCH_BOOKING_SUCCESS: {
            return {
                ...state,
                isLoading: false,
                bookings: action.bookings,
            };
        }

        case FETCH_BOOKING_FAILURE: {
            return {
                ...state,
                isLoading: false,
                error: action.error,
            };
        }

        default:
            return state;
    }
};

export default bookingReducer;