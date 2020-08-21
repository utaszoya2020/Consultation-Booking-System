import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import {
    Upload,
    message,
    Form,
    Input,
    Button,
    Select,
    Calendar,
} from 'antd';
import { capitalize } from 'lodash';
import TimePicker from './components/TimePicker';
import { InboxOutlined } from '@ant-design/icons';
import Confirm from '../../UI/confirm/Confirm';
import { fetchUserId } from '../../utils/authentication';
import { fetchUserDetail } from '../../utils/api/user';
import { fetchSession } from '../../utils/api/session';
import BASE_URL from '../../constants/env';
import { BOOKING_TOPIC, BOOKING_TYPE } from '../../constants/option';
import './styles/faceToFaceBooking.scss';

const layout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 16 },
};
const tailLayout = {
    wrapperCol: { offset: 4, span: 16 },
};
const { Option } = Select;

// TODO testing data, should retrive from user data
 

const FaceToFaceBooking = () => {
    const userId = fetchUserId();
    const [modalShow, setModalShow] = React.useState(false);
    const [topic, setTopic] = useState('');
    const [subject, setSubject] = useState('');
    const [content, setContent] = useState('');
    const [attachment, setAttachment] = useState([]);
    const [dateValue, setDateValue] = useState(moment().format('YYYY-MM-DD'));
    const [timeValue, setTime] = useState('');
    const [currentSession, setCurrentSession] = useState({});
    const [error, setError] = useState(null);
    const [campus, setCampus] = useState('');

    // Can not select days before today and today
    function disabledDate(current) {
        return (
            moment().add(-1, 'days') >= current ||
            moment().add(2, 'weeks') <= current
        );
    }

    useEffect(() => {
     
        fetchUserDetail(userId).then(data => {
            console.log(data);
            setCampus(data.campus);
          
        }
        
    
        );
      
    
    },[]);


    useEffect(()=>{
        const abortController = new AbortController();
        const signal = abortController.signal;
        console.log(signal);

        fetchSession(dateValue, campus, { signal: signal }).then(data => {
            console.log(data);
            if(data) {
                setCurrentSession(data);
            }
        })
        .catch((error) =>
            setError(error)
        );

        return function cleanup() {
            abortController.abort();
        };
    }, []);

    const handleDateChange = (value) => {
        setTime('');
        setCurrentSession({});
        setDateValue(value.toDate());
        const selectDate = moment(value).format('YYYY-MM-DD');
        fetchSession(selectDate, campus).then(data => {
            console.log(data);
            if(data) {
                setCurrentSession(data);
            }
        })
        .catch((error) =>
            setError(error)
        );
    };

    const handleTimeChange = event => {
        const time = event.target.value;
        setTime(time);
    };

    const handleCheckDate = (rule, value) => {
        if(!dateValue) {
            return Promise.reject('Please select your booking date!')
        }
        if(!timeValue) {
            return Promise.reject('Please select your booking time!')
        }
        return Promise.resolve();
    };

    const handleContentChange = event => {
        const content = event.target.value;
        setContent(content);
    };

    const handleAttachmentbeforeUpload = (file) => {
        const isLt10M = file.size / 1024 / 1024 < 10;
        if (!isLt10M) {
            message.error('File size should not exceed 5M');
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
        accept: '.doc,.docx,.pdf,.xlsx.jpg.jpeg.png', // Limit file type
        action: `${BASE_URL}/bookings/upload`,
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
        if (values.attachment) {
            const files = [];
            values.attachment.forEach((file) => {
                const res = file.response;
                files.push({
                    fileName: res.fileName,
                    fileLocation: res.fileLocation,
                });
            });
            setAttachment(files);
        }
    };

    const onReset = () => {
        faceToFaceBookingForm.resetFields();
    };

    const getFileList = (e) => {
        if(Array.isArray(e)) {
            return e;
        }
        return e && e.fileList;
    };

    return (
        <div className='online-booking'>
            <Confirm
                show={modalShow}
                type={BOOKING_TYPE.OFFLINE}
                campus={campus}
                userId={userId}
                topic={topic}
                subject={subject}
                content={content}
                bookingDate={dateValue}
                bookingTime={timeValue}
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
                        <Option value={BOOKING_TOPIC.FINANCE}>{capitalize(BOOKING_TOPIC.FINANCE)}</Option>
                        <Option value={BOOKING_TOPIC.ACCOMMODATION}>{capitalize(BOOKING_TOPIC.ACCOMMODATION)}</Option>
                        <Option value={BOOKING_TOPIC.COURSE}>{capitalize(BOOKING_TOPIC.COURSE)}</Option>
                        <Option value={BOOKING_TOPIC.OTHERS}>{capitalize(BOOKING_TOPIC.OTHERS)}</Option>
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
                            message: 'Please select your booking date!',
                        },
                        { validator: handleCheckDate }
                    ]}
                >
                    <div className='booking__calender'>
                        <div className='react-calender'>
                            <Calendar disabledDate={disabledDate} fullscreen={false} onPanelChange={handleDateChange} />
                        </div>
                        
                        <TimePicker session={currentSession.time} time={timeValue} handleTimeChange={handleTimeChange}/>
                    </div>
                </Form.Item>
                <Form.Item label='Content' name='content'>
                    <Input.TextArea
                        rows={4}
                        value={content}
                        onChange={handleContentChange}
                    />
                </Form.Item>
                <Form.Item label='Attachment' name='attachment' valuePropName='fileList' 
                        getValueFromEvent={getFileList}>
                    <Dragger {...fileProps}>
                        <p className='ant-upload-drag-icon'>
                            <InboxOutlined />
                        </p>
                        <p className='ant-upload-text'>
                            Click or drag file to this area to upload
                        </p>
                        <p className='ant-upload-hint'>
                            You can upload files up to a maximum of 5 MB.
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

const mapStateToProps = (state) => ({
    userId: state.login.userId,
    campus: state.user.campus,
    disableDate: state.booking.disableDate,
    error: state.booking.error,
    isLoading: state.booking.isLoading,
});

const mapDispatchToProps = () => ({});

export default connect(mapStateToProps, mapDispatchToProps)(FaceToFaceBooking);
