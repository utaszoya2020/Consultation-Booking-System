import {
    FETCH_USER_ACTION,
    FETCH_USER_SUCCESS,
    FETCH_USER_FAILURE,
} from '../actions/action.js';

const initialState = {
    firstName: '',
    lastName: '',
    campus: '',
    email: '',
    gender: '',
    phone: '',
    userType: '',
    disableDate: '',
    isLoading: false,
    error: null,
};

const userReducer = (state = initialState, action) => {
    switch (action.type) {
        case FETCH_USER_ACTION: {
            return {
                ...state,
                isLoading: true,
            };
        }

        case FETCH_USER_SUCCESS: {
            const { firstName, lastName, email, campus, gender, phone, userType, disableDate} = action.user;
            return {
                ...state,
                isLoading: false,
                firstName,
                lastName,
                email,
                campus,
                gender,
                phone,
                userType,
                disableDate,
            };
        }

        case FETCH_USER_FAILURE: {
            return {
                ...state,
                isLoading: false,
                error: action.error
            };
        }

        default:
            return state;
    }
};

export default userReducer;
