import React from 'react';
import { Link } from 'react-router-dom';
import { Result, Button } from 'antd';
import { STUDENT_HOME_BASE_URL } from '../../routes/URLMap';
import './successMessage.scss';

function SuccessMessage() {

    return (
        <div className='message__container'>
            <Result
                status='success'
                title='Successfully Submitted Your Booking Request!'
                subTitle='Order number: 2017182818828182881 Cloud server configuration takes 1-5 minutes, please wait.'
                extra={
                    <Link to={STUDENT_HOME_BASE_URL}>
                        <Button
                            type='primary'
                            key='console'
                        >
                            Back Home
                        </Button>
                    </Link>
                }
            />
        </div>
    );
}

export default SuccessMessage;
