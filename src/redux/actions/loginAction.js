import {
    CHANGE_EMAIL_INPUT,
    CHANGE_PASSWORD_INPUT,
    LOGIN_ACTION,
    LOGIN_SUCCESS,
    LOGIN_FAILURE,
} from "./action.js";

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

export const logInSuccess = (data) => ({
    data,
    type: LOGIN_SUCCESS,
});

export const logInFailure = (error) => ({
    error,
    type: LOGIN_FAILURE,
});

export const LogInThunkAction = (inputEmail, inputPassword) => ({
    inputEmail,
    inputPassword,
    type: LOGIN_ACTION,
});
