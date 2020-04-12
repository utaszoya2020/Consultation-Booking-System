import { combineReducers } from 'redux';

import loginReducer from './loginReducer';

import bookingReducer from './bookingReducer';

const reducers = combineReducers({
    login: loginReducer,
    booking: bookingReducer,
});

export default reducers;
