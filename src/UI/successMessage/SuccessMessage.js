import React from 'react';
import { Result, Button } from 'antd';
import { STUDENT_HOME_URL } from '../../routes/URLMap';
import './successMessage.scss';

function SuccessMessage() {

    return (
        <div className='message__container'>
            <Result
                status='success'
                title='Successfully Submitted Your Booking Request!'
                subTitle='Order number: 2017182818828182881 Cloud server configuration takes 1-5 minutes, please wait.'
                extra={
                        <Button
                            type='primary'
                            key='console'
                            href={STUDENT_HOME_URL}
                        >
                            Back Home
                        </Button>
                }
            />
        </div>
    );
}

export default SuccessMessage;
