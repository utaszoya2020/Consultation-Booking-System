import {
    CHANGE_EMAIL_INPUT,
    CHANGE_PASSWORD_INPUT,
    LOGIN_ACTION,
    LOGIN_SUCCESS,
    LOGIN_FAILURE,
} from '../actions/action.js';

const initialState = {
    userId: '',
    userName: '',
    inputEmail: '',
    inputPassword: '',
    userType: '',
    isLoading: false,
    error: null,
    token: null,
};

const loginReducer = (state = initialState, action) => {
    switch (action.type) {
        case CHANGE_EMAIL_INPUT: {
            const inputEmail = action.event.target.value;

            return {
                ...state,
                inputEmail,
            };
        }

        case CHANGE_PASSWORD_INPUT: {
            return {
                ...state,
                inputPassword: action.event.target.value,
            };
        }

        case LOGIN_ACTION: {
            return {
                ...state,
                isLoading: true,
            };
        }

        case LOGIN_SUCCESS: {
            const { payload } = action;
            console.log(payload);
            return {
                ...state,
                isLoading: false,
                token: payload.token,
                userId: payload.user.id,
                userName: payload.user.name,
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
