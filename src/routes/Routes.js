import React from "react";
import { Redirect, Route, Switch } from "react-router-dom";
import Home from "../student/home/Home";
import OnlineBooking from "../student/onlineBooking/OnlineBooking";
import MyOnlineBooking from "../student/myBooking/MyOnlineBooking";
import SuccessMessage from "../UI/successMessage/SuccessMessage";
import {
  STUDENT_HOME_BASE_URL,
  ONLINE_BOOKING_URL,
  MY_ONLINE_BOOKING_URL,
  MY_FACETOFACE_BOOKING_URL,
  SUCCESS_URL,
  ERROR_URL
} from "./URLMap";

const Routes = () => {
  return (
    <React.Fragment>
      <Switch>
        <Redirect exact from="/" to={STUDENT_HOME_BASE_URL} />
        <Redirect exact from="/student" to={STUDENT_HOME_BASE_URL} />
        <Route exact path={STUDENT_HOME_BASE_URL} component={Home} />
        <Route exact path={ONLINE_BOOKING_URL} component={OnlineBooking} />
        <Route exact path={SUCCESS_URL} component={SuccessMessage} />
        <Route
          exact
          path={MY_FACETOFACE_BOOKING_URL}
          component={OnlineBooking}
        />
        {/* <ProtectedRoute exact path={CHECKOUT_URL} component={CheckOut} /> */}
      </Switch>
    </React.Fragment>
  );
};

export default Routes;
