import React from 'react';
import { Result, Button } from 'antd';
import { LOGIN_URL } from '../../routes/URLMap';
import { SmileOutlined } from '@ant-design/icons';
import './successMessage.scss';

function LogoutSuccess() {

    return (
        <div className='message__container'>
            <Result
                icon={<SmileOutlined />}
                title="You have logout Successfully!"
                extra={
                        <Button
                            type='primary'
                            key='console'
                            href={LOGIN_URL}
                        >
                            Log in
                        </Button>
                }
            />
        </div>
    );
}

export default LogoutSuccess;