import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import {
    changeEmailInputAction,
    changePasswordInputAction,
    LogInThunkAction,
} from '../redux/actions/loginAction';
import { Form, Input, Button, Checkbox, Spin, Alert } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import './logIn.scss';

const LoginForm = (props) => {
    const {
        inputEmail,
        inputPassword,
        handleEmailInputChange,
        handlePasswordInputChange,
        handleLogIn,
        isLoading,
        isAuthenticated,
        error
    } = props;
    const onFinish = (values) => {
        console.log('Received values of form: ', values);
    };

    let authRedirect = null;
    if (isAuthenticated) {
        authRedirect = <Redirect to='/' />;
    }

    let errorMessage = null;
    if (error) {
        errorMessage = (
            <Form.Item>
                <Alert message='Invalid Email or Password' type='error' />
            </Form.Item>
        );
    }
    return (
        <div className='l-login'>
            {isLoading ? (
                <Spin size='large' tip='Loading...' />
            ) : (
                <Fragment>
                    {authRedirect}
                    <h1 className='l-login__title'>AIBT Booking System</h1>
                    <div className='b-form-container'>
                        <Form
                            name='normal_login'
                            className='login-form'
                            initialValues={{
                                remember: true,
                            }}
                            onFinish={onFinish}
                        >
                            {errorMessage}
                            <Form.Item
                                name='email'
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please input your Email!',
                                    },
                                ]}
                            >
                                <Input
                                    prefix={
                                        <UserOutlined className='site-form-item-icon' />
                                    }
                                    placeholder='Email'
                                    onChange={handleEmailInputChange}
                                    value={inputEmail}
                                />
                            </Form.Item>
                            <Form.Item
                                name='password'
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please input your Password!',
                                    },
                                ]}
                            >
                                <Input
                                    prefix={
                                        <LockOutlined className='site-form-item-icon' />
                                    }
                                    type='password'
                                    placeholder='Password'
                                    onChange={handlePasswordInputChange}
                                    value={inputPassword}
                                />
                            </Form.Item>
                            <Form.Item>
                                <Form.Item
                                    name='remember'
                                    valuePropName='checked'
                                    noStyle
                                >
                                    <Checkbox>Remember me</Checkbox>
                                </Form.Item>

                                <a className='login-form-forgot' href=''>
                                    Forgot password
                                </a>
                            </Form.Item>

                            <Form.Item>
                                <Button
                                    type='primary'
                                    htmlType='submit'
                                    className='login-form-button'
                                    onClick={handleLogIn}
                                >
                                    Log in
                                </Button>
                                <p className='l-login__register'>
                                    Or <a href=''>register now!</a>
                                </p>
                            </Form.Item>
                        </Form>
                    </div>
                </Fragment>
            )}
            ;
        </div>
    );
};

const mapStateToProps = (state) => ({
    inputEmail: state.login.inputEmail,
    inputPassword: state.login.inputPassword,
    isLoading: state.login.isLoading,
    error: state.login.error,
    isAuthenticated: state.login.token !== null,
});

const mapDispatchToProps = (dispatch) => ({
    handleEmailInputChange: (event) => dispatch(changeEmailInputAction(event)),
    handlePasswordInputChange: (event) =>
        dispatch(changePasswordInputAction(event)),
    handleLogIn: () => dispatch(LogInThunkAction()),
});

export default connect(mapStateToProps, mapDispatchToProps)(LoginForm);
