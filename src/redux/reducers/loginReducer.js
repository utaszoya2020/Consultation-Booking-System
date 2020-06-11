import {
    LOGIN_ACTION,
    LOGIN_SUCCESS,
    LOGIN_FAILURE,
} from '../actions/action.js';

const initialState = {
    inputEmail: '',
    inputPassword: '',
    isLoading: false,
    error: null,
    token: null,
    userType: ''
};

const loginReducer = (state = initialState, action) => {
    switch (action.type) {
        case LOGIN_ACTION: {
            return {
                ...state,
                isLoading: true,
            };
        }

        case LOGIN_SUCCESS: {
            const { payload } = action;
            return {
                ...state,
                isLoading: false,
                token: payload.token,
                userType: payload.user.userType
            };
        }

        case LOGIN_FAILURE: {
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

export default loginReducer;
