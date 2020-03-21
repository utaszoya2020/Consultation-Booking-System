import React from "react";
import { Redirect, Route, Switch } from "react-router-dom";
import Home from "../student/home/Home";

import { STUDENT_HOME_BASE_URL, ERROR_URL } from "./URLMap";

const Routes = () => {
  return (
    <React.Fragment>
      <Switch>
        <Redirect exact from="/" to={STUDENT_HOME_BASE_URL} />
        <Redirect exact from="/student" to={STUDENT_HOME_BASE_URL} />
        <Route exact path={STUDENT_HOME_BASE_URL} component={Home} />
        {/* <ProtectedRoute exact path={CHECKOUT_URL} component={CheckOut} /> */}
      </Switch>
    </React.Fragment>
  );
};

export default Routes;
