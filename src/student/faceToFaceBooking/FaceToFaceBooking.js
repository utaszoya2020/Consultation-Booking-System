import React, { useState } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import {
    Upload,
    message,
    Form,
    Input,
    Button,
    Select,
    DatePicker,
    Space,
} from 'antd';
import { InboxOutlined } from '@ant-design/icons';
import Confirm from '../../UI/confirm/Confirm';
import { fetchUserId } from '../../utils/authentication';
import './styles/faceToFaceBooking.scss';

const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
};
const tailLayout = {
    wrapperCol: { offset: 8, span: 16 },
};

const FaceToFaceBooking = props => {
    const userId = fetchUserId();
    const [modalShow, setModalShow] = React.useState(false);
    const [type, setType] = useState('Offline');
    const [campus, setCampus] = useState('Hobart');
    const [topic, setTopic] = useState('');
    const [subject, setSubject] = useState('');
    const [content, setContent] = useState('');
    const [bookingDate, setBookingDate] = useState('');
    const [attachment, setAttachment] = useState([]);

    const { Option } = Select;

    function range(start, end) {
        const result = [];
        for (let i = start; i < end; i++) {
            result.push(i);
        }
        return result;
    }

    function hourRange(
        firstStart,
        FirstEnd,
        secondStart,
        secondEnd,
        breakTime
    ) {
        const result = [];
        for (let i = firstStart; i < FirstEnd; i++) {
            result.push(i);
        }
        for (let i = secondStart; i < secondEnd; i++) {
            result.push(i);
        }
        result.push(breakTime);
        return result;
    }

    function disabledDate(current) {
        // Can not select days before today and today
        return (
            moment().add(-1, 'days') >= current ||
            moment().add(2, 'weeks') <= current
        );
    }

    function disabledDateTime() {
        return {
            disabledHours: () => hourRange(0, 9, 17, 24, 12),
            disabledMinutes: () => range(1, 60),
            disabledSeconds: () => range(1, 60),
        };
    }

    function onDateChange(date, dateString) {
        const bookingDate = moment(date).toDate();
        setBookingDate(bookingDate);
    }

    const handleContentChange = event => {
        const content = event.target.value;
        setContent(content);
    }

    const handleAttachmentbeforeUpload = (file) => {
        const isLt10M = file.size / 1024 / 1024 < 10;
        if (!isLt10M) {
            message.error('文件大小不能超过10M');
        }
        return new Promise((resolve, reject) => {
            if (!isLt10M) {
                reject(file);
            } else {
                resolve(file);
            }
        });
    };

    const { Dragger } = Upload;
    const fileProps = {
        name: 'file',
        multiple: true,
        action: 'http://localhost:4000/api/bookings/upload/file-upload',
        onChange(info) {
            const { status } = info.file;
            if (status === 'done') {
                message.success(
                    `${info.file.name} file uploaded successfully.`
                );
            } else if (status === 'error') {
                message.error(`${info.file.name} file upload failed.`);
            }
        },
        beforeUpload: (info) => handleAttachmentbeforeUpload(info),
    };

    const [faceToFaceBookingForm] = Form.useForm();
    const onFinish = (values) => {
        setTopic(values.topic);
        setSubject(values.subject);
        if (values.attachment && !values.attachment.file.response.error) {
            const files = [];
            values.attachment.fileList.forEach((file) => {
                const res = file.response;
                files.push({
                    fileName: res.fileName,
                    fileLocation: res.fileLocation,
                });
            });
            setAttachment(files);
        }
    };

    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
        setModalShow(false);
    };

    const onReset = () => {
        faceToFaceBookingForm.resetFields();
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
                attachment={attachment}
                onHide={() => setModalShow(false)}
            />
            <div className='online-booking__title'>
                <h3>Face To Face Consultation</h3>
            </div>

            <Form
                {...layout}
                name='faceToFaceBookingForm'
                form={faceToFaceBookingForm}
                initialValues={{
                    remember: true,
                }}
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
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
                    <Select placeholder='Please select a topic'>
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
                    <Input placeholder='Type your subject' />
                </Form.Item>

                <Form.Item
                    label='Date'
                    name='date'
                    rules={[
                        {
                            required: true,
                            message: 'Please select your booking date!',
                        },
                    ]}
                >
                    <DatePicker
                        format='YYYY-MM-DD HH:mm:ss'
                        disabledDate={disabledDate}
                        disabledTime={disabledDateTime}
                        showTime={{
                            defaultValue: moment('00:00:00', 'HH:mm:ss'),
                        }}
                        onChange={onDateChange}
                    />
                </Form.Item>

                <Form.Item label='Content' name='content'>
                    <Input.TextArea
                        rows={4}
                        value={content}
                        onChange={handleContentChange}
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
                            Support for a single or bulk upload.
                        </p>
                    </Dragger>
                </Form.Item>

                <Form.Item {...tailLayout}>
                    <Space size='middle'>
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
                    </Space>
                </Form.Item>
            </Form>
        </div>
    );
};

const mapStateToProps = (state) => ({
    userId: state.login.userId,
    disableDate: state.booking.disableDate,
    error: state.booking.error,
    isLoading: state.booking.isLoading,
});

const mapDispatchToProps = () => ({});

export default connect(mapStateToProps, mapDispatchToProps)(FaceToFaceBooking);
