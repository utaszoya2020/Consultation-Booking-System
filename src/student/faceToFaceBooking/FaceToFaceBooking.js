import React, { useState } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import { Upload, message, Form, Input, Button, Select, DatePicker } from 'antd';
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

const FaceToFaceBooking = () => {
    const userId = fetchUserId();
    const [modalShow, setModalShow] = React.useState(false);
    const [type, setType] = useState('Online');
    const [campus, setCampus] = useState('Hobart');
    const [topic, setTopic] = useState('');
    const [subject, setSubject] = useState('');
    const [content, setContent] = useState('no');
    const [bookingDate, setBookingDate] = useState('');
    const [fileList, setFilelist] = useState([]);

    const subjectChangeHandler = (event) => {
        setSubject(event.target.value);
    };

    const topicChangeHandler = (value) => {
        setTopic(value);
    };

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
        action: 'http://localhost:4000/api/bookings/uploadfile/file-upload',
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
        beforeUpload: (info) => handleAttachmentbeforeUpload(info),
    };

    const [faceToFaceBookingForm] = Form.useForm();
    const onFinish = (values) => {
        console.log('Success:', values);
    };

    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    const onReset = () => {
        faceToFaceBookingForm.resetFields();
    };

    const handleFileChange = (event) => {
        console.log(event.target);
    }

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
                <h3>Face To Face Consultation</h3>
            </div>

            <Form
                {...layout}
                name='onlineBookingForm'
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
                    <Select
                        placeholder='Please select a topic'
                        onChange={topicChangeHandler}
                        size='large'
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
                        size='large'
                    />
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
                        size='large'
                        onChange={onDateChange}
                    />
                </Form.Item>

                <Form.Item
                    label='Dragger'
                    name='dragger'
                    valuePropName='fileList'
                    getValueFromEvent={handleFileChange}
                >
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
                    ,
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

{
    /* const onChange = (date) => this.setState({ date });

const tileDisabled = ({ date, view }) =>
    date.getDay() === 6 || date.getDay() === 0;

const handleTimeChange = (event) => {
    const key = event.target.name;
    const value = event.target.value;
    const timeString = event.target.innerHTML;

    this.setState({
        [key]: value,
        timeString,
    });
}; */
    /* <Form>
          <Form.Group as={Row} controlId='formHorizontalTopic'>
            <Form.Label column='lg' lg={2}>
              Topic
            </Form.Label>
            <Col lg={10}>
              <Form.Control as='select' value='Choose...'>
                <option>Finance...</option>
                <option>Accommodation...</option>
                <option>Cource...</option>
                <option>Others...</option>
              </Form.Control>
            </Col>
          </Form.Group>

          <Form.Group as={Row} controlId='formPlaintextSubject'>
            <Form.Label column='lg' lg={2}>
              Subject
            </Form.Label>
            <Col lg='10'>
              <Form.Control type='text' placeholder='Subject' />
            </Col>
          </Form.Group>

          <Form.Group as={Row} controlId='formHorizontalContent'>
            <Form.Label column='lg' lg={2}>
              Date
            </Form.Label>
            <Col lg={10}>
              {timeString === '' ? null : (
                <h5 className='booking__block'>{`${selectDate}  ${timeString}`}</h5>
              )}
              <div className='booking__calander'>
                <Calendar
                  onChange={this.onChange}
                  value={this.state.date}
                  tileDisabled={this.tileDisabled}
                />
                <TimePicker handleTimeChange={this.handleTimeChange} />
              </div>
            </Col>
          </Form.Group>

          <Form.Group as={Row} controlId='formHorizontalAttachment'>
            <Form.Label column='lg' lg={2}>
              Attachment
            </Form.Label>
            <Col lg={10}>
              <Dragger {...props}>
                <p className='ant-upload-drag-icon'>
                  <InboxOutlined />
                </p>
                <p className='ant-upload-text'>
                  Click or drag file to this area to upload
                </p>
                <p className='ant-upload-hint'>
                  Support for a single or bulk upload. Strictly prohibit from
                  uploading company data or other band files
                </p>
              </Dragger>
            </Col>
          </Form.Group>

          <Form.Group as={Row}>
            <Col lg={{ span: 10, offset: 2 }}>
              <Button variant='primary' onClick={this.handleSubmit}>
                Submit
              </Button>
              <Button
                variant='outline-secondary'
                type='reset'
                href={FACE_TO_FACE_BOOKING_URL}
              >
                Reset
              </Button>
            </Col>
          </Form.Group>
        </Form> */
}

const mapStateToProps = (state) => ({
    disableDate: state.booking.disableDate,
    error: state.booking.error,
    isLoading: state.booking.isLoading,
});

const mapDispatchToProps = () => ({});

export default connect(mapStateToProps, mapDispatchToProps)(FaceToFaceBooking);
