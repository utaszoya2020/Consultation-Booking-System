import React, { useState, useRef } from 'react';
import JoditEditor from 'jodit-react';
import { Upload, message, Form, Input, Button, Select } from 'antd';
import { InboxOutlined } from '@ant-design/icons';
import Confirm from '../../UI/confirm/Confirm';
import { fetchUserId } from '../../utils/authentication';
import './onlineBooking.scss';

const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
};
const tailLayout = {
    wrapperCol: { offset: 8, span: 16 },
};

const OnlineBooking = () => {
    const userId = fetchUserId();
    const [modalShow, setModalShow] = React.useState(false);
    const editor = useRef(null);
    const [content, setContent] = useState('');
    const [type, setType] = useState('Online');
    const [campus, setCampus] = useState('Hobart');
    const [bookingDate, setBookingDate] = useState(new Date());
    const [topic, setTopic] = useState('');
    const [subject, setSubject] = useState('');
    const config = {
        readonly: false,
    };

    const subjectChangeHandler = (event) => {
        setSubject(event.target.value);
    };

    const topicChangeHandler = (value) => {
        setTopic(value);
    };

    const { Option } = Select;

    const { Dragger } = Upload;
    const fileProps = {
        name: 'file',
        multiple: true,
        action: 'https://www.mocky.io/v2/5cc8019d300000980a055e76',
        onChange(info) {
            const { status } = info.file;
            if (status !== 'uploading') {
                console.log(info.file, info.fileList);
            }
            if (status === 'done') {
                message.success(
                    `${info.file.name} file uploaded successfully.`
                );
            } else if (status === 'error') {
                message.error(`${info.file.name} file upload failed.`);
            }
        },
    };

    const [onlineBookingForm] = Form.useForm();

    const onFinish = (values) => {
        console.log('Success:', values);
    };

    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    const onReset = (history) => {
        onlineBookingForm.resetFields();
        console.log(history);
    };

    return (
        <div className='online-booking'>
            <Confirm
                show={modalShow}
                type={type}
                campus={campus}
                userId={userId}
                topic={topic}
                subject={subject}
                content={content}
                bookingDate={bookingDate}
                onHide={() => setModalShow(false)}
            />
            <div className='online-booking__title'>
                <h3>Online Consultation</h3>
            </div>
            <Form
                {...layout}
                name='onlineBookingForm'
                form={onlineBookingForm}
                initialValues={{
                    remember: true,
                }}
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                size='large'
            >
                <Form.Item
                    name='topic'
                    label='Topic'
                    hasFeedback
                    rules={[
                        {
                            required: true,
                            message: 'Please select your Topic!',
                        },
                    ]}
                >
                    <Select
                        placeholder='Please select a topic'
                        onChange={topicChangeHandler}
                    >
                        <Option value='finance'>Finance</Option>
                        <Option value='accommodation'>Accommodation</Option>
                        <Option value='course'>Course</Option>
                        <Option value='others'>Others</Option>
                    </Select>
                </Form.Item>
                <Form.Item
                    label='Subject'
                    name='subject'
                    rules={[
                        {
                            required: true,
                            message: 'Please input your subject!',
                        },
                    ]}
                >
                    <Input
                        placeholder='Type your subject'
                        onChange={subjectChangeHandler}
                    />
                </Form.Item>

                <Form.Item
                    label='Content'
                    name='content'
                    rules={[
                        {
                            required: true,
                            message: 'Please input your content!',
                        },
                    ]}
                >
                    <JoditEditor
                        ref={editor}
                        value={content}
                        config={config}
                        tabIndex={1} // tabIndex of textarea
                        onBlur={(newContent) => setContent(newContent)} // preferred to use only this option to update the content for performance reasons
                    />
                </Form.Item>

                <Form.Item label='Attachment' name='attachment'>
                    <Dragger {...fileProps}>
                        <p className='ant-upload-drag-icon'>
                            <InboxOutlined />
                        </p>
                        <p className='ant-upload-text'>
                            Click or drag file to this area to upload
                        </p>
                        <p className='ant-upload-hint'>
                            Support for a single or bulk upload. Strictly
                            prohibit from uploading company data
                        </p>
                    </Dragger>
                </Form.Item>

                <Form.Item {...tailLayout}>
                    <Button
                        type='primary'
                        htmlType='submit'
                        onClick={() => setModalShow(true)}
                    >
                        Submit
                    </Button>
                    <Button htmlType='button' onClick={onReset}>
                        Reset
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
};

export default OnlineBooking;
