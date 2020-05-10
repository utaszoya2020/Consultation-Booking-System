import { login } from '../../utils/api/auth';
import { setToken, fetchUser } from '../../utils/authentication';

import {
    LOGIN_ACTION,
    LOGIN_SUCCESS,
    LOGIN_FAILURE,
} from './action.js';

export const logInAction = () => ({
    type: LOGIN_ACTION,
});

export const logInSuccess = (payload) => ({
    payload,
    type: LOGIN_SUCCESS,
});

export const logInFailure = (error) => ({
    error,
    type: LOGIN_FAILURE,
});

export const LogInThunkAction = (email, password) => (dispatch) => {
    dispatch(logInAction());
    login(email, password)
        .then((token) => {
            setToken(token);
            const user = fetchUser(token);
            const payload = {
                user,
                token
            }
            dispatch(logInSuccess(payload));
        })
        .catch((error) => {
            dispatch(logInFailure(error));
        });
};

