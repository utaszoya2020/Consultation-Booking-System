import React from "react";
import { connect } from "react-redux";
import {
  changeEmailInputAction,
  changePasswordInputAction,
  LogInThunkAction,
} from "../redux/actions/loginAction";
import { Form, Input, Button, Checkbox } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import "./logIn.scss";

const LoginForm = props => {
  const onFinish = (values) => {
    console.log("Received values of form: ", values);
  };

  return (
    <div className="l-login">
      <h1 className="l-login__title">AIBT Booking System</h1>
      <div className="b-form-container">
        <Form
          name="normal_login"
          className="login-form"
          initialValues={{
            remember: true,
          }}
          onFinish={onFinish}
        >
          <Form.Item
            name="email"
            rules={[
              {
                required: true,
                message: "Please input your Email!",
              },
            ]}
          >
            <Input
              prefix={<UserOutlined className="site-form-item-icon" />}
              placeholder="Email"
              onChange={props.handleEmailInputChange}
              value={props.inputEmail}
            />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[
              {
                required: true,
                message: "Please input your Password!",
              },
            ]}
          >
            <Input
              prefix={<LockOutlined className="site-form-item-icon" />}
              type="password"
              placeholder="Password"
              onChange={props.handlePasswordInputChange}
              value={props.inputPassword}
            />
          </Form.Item>
          <Form.Item>
            <Form.Item name="remember" valuePropName="checked" noStyle>
              <Checkbox>Remember me</Checkbox>
            </Form.Item>

            <a className="login-form-forgot" href="">
              Forgot password
            </a>
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="login-form-button"
              onClick={props.handleLogIn}
            >
              Log in
            </Button>
            <p className="l-login__register">
              Or <a href="">register now!</a>
            </p>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  inputEmail: state.login.inputEmail,
  inputPassword: state.login.inputPassword,
});

const mapDispatchToProps = (dispatch) => ({
  handleEmailInputChange: (event) => dispatch(changeEmailInputAction(event)),
  handlePasswordInputChange: (event) =>
    dispatch(changePasswordInputAction(event)),
  handleLogIn: (inputEmail, inputPassword) =>
    dispatch(LogInThunkAction(inputEmail, inputPassword)),
});

export default connect(mapStateToProps, mapDispatchToProps)(LoginForm);
