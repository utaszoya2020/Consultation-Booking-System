import { combineReducers } from 'redux';

import loginReducer from './loginReducer';
import userReducer from './userReducer';
import bookingReducer from './bookingReducer';

const reducers = combineReducers({
    login: loginReducer,
    booking: bookingReducer,
    user: userReducer
});

export default reducers;
