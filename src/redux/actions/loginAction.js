import { login } from '../../utils/api/auth';
import { setToken } from '../../utils/authentication';

import {
    CHANGE_EMAIL_INPUT,
    CHANGE_PASSWORD_INPUT,
    LOGIN_ACTION,
    LOGIN_SUCCESS,
    LOGIN_FAILURE,
} from './action.js';

export const changeEmailInputAction = (event) => ({
    event,
    type: CHANGE_EMAIL_INPUT,
});

export const changePasswordInputAction = (event) => ({
    event,
    type: CHANGE_PASSWORD_INPUT,
});

export const logInAction = () => ({
    type: LOGIN_ACTION,
});

export const logInSuccess = (token) => ({
    token,
    type: LOGIN_SUCCESS,
});

export const logInFailure = (error) => ({
    error,
    type: LOGIN_FAILURE,
});

export const LogInThunkAction = () => (dispatch, getState) => {
    dispatch(logInAction());
    const latestState = getState();
    const inputEmail = latestState.login.inputEmail;
    const inputPassword = latestState.login.inputPassword;
    login(inputEmail, inputPassword)
        .then((token) => {
            dispatch(logInSuccess(token));
            setToken(token);
        })
        .catch((error) => {
            dispatch(logInFailure(error));
        });
};
