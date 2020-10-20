import React from 'react';
import { Result, Button } from 'antd';
import { STUDENT_HOME_URL } from '../../routes/URLMap';
import './successMessage.scss';

function SuccessMessage(props) {
    const { location } = props;
    console.log(location.state.type);
    const msg =
        location.state.type === 'online'
            ? 'You have started an online consultation, our counsellor will get back to you soon.'
            : 'Thank you for booking face to face consultation, please wait for the counsellor’s confirmation.';

    return (
        <div className='message__container'>
            <Result
                status='success'
                title='Successfully Submitted Your Booking Request!'
                subTitle={msg}
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
