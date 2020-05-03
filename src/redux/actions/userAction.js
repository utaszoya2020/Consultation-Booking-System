import {
    FETCH_USER_ACTION,
    FETCH_USER_SUCCESS,
    FETCH_USER_FAILURE,
} from './action.js';
import { fetchUserDetail } from '../../utils/api/user';

export const fetchUserAction = () => ({
           type: FETCH_USER_ACTION,
       });

export const fetchUserSuccess = (user) => ({
           user,
           type: FETCH_USER_SUCCESS,
       });

export const fetchUserFailure = (error) => ({
           error,
           type: FETCH_USER_FAILURE,
       });

export const fetchUserDetailThunkAction = (userId) => (dispatch) => {
           dispatch(fetchUserAction());
           fetchUserDetail(userId)
               .then((user) => {
                   dispatch(fetchUserSuccess(user));
               })
               .catch((error) => {
                   dispatch(fetchUserFailure(error));
               });
       };