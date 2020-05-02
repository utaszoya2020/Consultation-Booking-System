import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import Home from '../student/home/Home';
import LoginForm from '../logIn/LogIn';
import OnlineBooking from '../student/onlineBooking/OnlineBooking';
import FaceToFaceBooking from '../student/faceToFaceBooking/FaceToFaceBooking';
import MyOnlineBooking from '../student/myBooking/MyOnlineBooking';
import MyFaceToFaceBooking from '../student/myBooking/MyFaceToFaceBooking';
import SuccessMessage from '../UI/successMessage/SuccessMessage';
import ErrorMessage from '../UI/errorMessage/ErrorMessage';
import Admin from '../admin/admin/Admin';

import {
  LOGIN_URL,
  REGISTER_URL,
  STUDENT_HOME_URL,
  MY_ONLINE_BOOKING_URL,
  MY_FACETOFACE_BOOKING_URL,
  ONLINE_BOOKING_URL,
  FACE_TO_FACE_BOOKING_URL,
  SUCCESS_URL,
  ERROR_URL,
  ADMIN_HOME_URL
} from './URLMap';

const Routes = () => {
  return (
    <React.Fragment>
      <Switch>
        <Redirect exact from='/' to={STUDENT_HOME_URL} />
        <Redirect exact from='/student' to={STUDENT_HOME_URL} />
        <Route exact path={LOGIN_URL} component={LoginForm} />
        <Route exact path={STUDENT_HOME_URL} component={Home} />
        <Route
          exact
          path={MY_FACETOFACE_BOOKING_URL}
          component={MyFaceToFaceBooking}
        />
        <Route exact path={MY_ONLINE_BOOKING_URL} component={MyOnlineBooking} />
        <Route exact path={ONLINE_BOOKING_URL} component={OnlineBooking} />
        <Route
          exact
          path={FACE_TO_FACE_BOOKING_URL}
          component={FaceToFaceBooking}
        />
        <Route exact path={SUCCESS_URL} component={SuccessMessage} />
        <Route exact path={ERROR_URL} component={ErrorMessage} />
        <Route exact path={ADMIN_HOME_URL} component={Admin} />

        {/* <ProtectedRoute exact path={CHECKOUT_URL} component={CheckOut} /> */}
      </Switch>
    </React.Fragment>
  );
};

export default Routes;
