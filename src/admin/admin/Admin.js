import React from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import {
    Row,
    Col,
    Input,
    Descriptions,
    Button,
    Comment,
    Avatar,
    List,
    Form,
} from 'antd';
import BookingCard from '../../student/myBooking/components/BookingCard';
import { fetchUserId } from '../../utils/authentication';
import {
    fetchAllBookingThunkAction,
    fetchBookingDetailThunkAction,
} from '../../redux/actions/bookingAction';
import { fetchUserDetailThunkAction } from '../../redux/actions/userAction';
import {
    addChat,
    updateChat,
    fetchAllChatByBookingId,
} from '../../utils/api/booking';
import { DownloadOutlined } from '@ant-design/icons';
import './admin.scss';

const { Search, TextArea } = Input;

const CommentList = ({ comments }) => (
    <List
        dataSource={comments}
        header={`${comments.length} ${
            comments.length > 1 ? 'replies' : 'reply'
        }`}
        itemLayout='horizontal'
        renderItem={(props) => <Comment {...props} />}
    />
);

const Editor = ({ onChange, onSubmit, submitting, value }) => (
    <div>
        <Form.Item>
            <TextArea rows={4} onChange={onChange} value={value} />
        </Form.Item>
        <Form.Item>
            <Button
                htmlType='submit'
                loading={submitting}
                onClick={onSubmit}
                type='primary'
            >
                Add Comment
            </Button>
        </Form.Item>
    </div>
);

class Admin extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            activeTab: 'offline',
            searchValue: '',
            currentBookingId: '', // Delete later
            activeBooking: false,
            submitting: false,
            value: '',
            chatId: '',
            originalChat: [], //chatRecord in database
            comments: [],
        };
    }

    componentDidMount() {
        const { fetchUserDetail } = this.props;
        this.props.getAllBookings();
        const userId = fetchUserId();
        this.setState({ userId }, () => {
            fetchUserDetail(userId);
        });
    }

    changeTabKey = (event) => {
        const activeTab = event.target.id;
        this.setState({
            activeTab,
            activeBooking: false
        });
    };

    searchBooking = (value) => {
        this.setState({ searchValue: value });
    };

    handleClickBooking = (bookingId) => {
        const { getBookingDetail } = this.props;
        getBookingDetail(bookingId);
        fetchAllChatByBookingId(bookingId)
            .then((chat) => {
                const newChat = this.transChatRecords(chat);
                const { chatId, originalChat, chatRecords } = newChat;
                this.setState({ chatId, originalChat, comments: chatRecords });
            })
            .catch((error) => {
                this.setState({ error, isLoading: false });
            });
        this.setState({
            activeBooking: true,
            currentBookingId: bookingId,
            value: '',
        });
    };

    transChatRecords = (chat) => {
        if (chat) {
            const chatId = chat._id;
            const originalChat = chat.chatRecords;
            const chatRecords = [];
            originalChat.forEach((record) => {
                const { author, content, time } = record;
                const authorName = `${author.firstName} ${author.lastName}`;

                const newChat = {
                    author: authorName,
                    avatar:
                        'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png',
                    content,
                    datetime: moment(time).fromNow(),
                };
                chatRecords.push(newChat);
            });
            const newChat = { chatId, originalChat, chatRecords };
            return newChat;
        } else {
            const chatId = '';
            const originalChat = '';
            const chatRecords = [];
            const newChat = { chatId, originalChat, chatRecords };
            return newChat;
        }
    };

    handleSubmit = () => {
        if (!this.state.value) {
            return;
        }
        this.setState({ submitting: true });
        setTimeout(() => {
            const {
                chatId,
                originalChat,
                userId,
                currentBookingId,
                value,
            } = this.state;
            const { firstName, lastName } = this.props;
            const author = `${firstName} ${lastName}`;
            this.setState(
                () => ({
                    submitting: false,
                    comments: [
                        {
                            author,
                            avatar:
                                'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png',
                            content: value,
                            datetime: moment().fromNow(),
                        },
                        ...this.state.comments,
                    ],
                }),
                () => {
                    //const { currentBookingId, value } = this.state;
                    const Msg = {
                        author: userId,
                        content: value,
                        time: new Date(),
                    };
                    if (!chatId) {
                        const newchatRecords = [Msg];
                        const chat = {
                            bookingId: currentBookingId,
                            studentId: userId,
                            chatRecords: newchatRecords,
                        };
                        addChat(chat)
                            .then((data) => {
                                if (data) {
                                    const newChat = this.transChatRecords(data);
                                    const {
                                        chatId,
                                        originalChat
                                    } = newChat;
                                    this.setState({
                                        chatId,
                                        originalChat
                                    });
                                }
                            })
                            .catch((error) =>
                                this.setState({ error, isLoading: false })
                            );
                    } else {
                        const records = [];
                        originalChat.forEach((record) => {
                            let { author, content, time } = record;

                            time = new Date(time);
                            const item = {
                                author,
                                content,
                                time,
                            };
                            records.push(item);
                        });
                        records.push(Msg);
                        updateChat(chatId, records)
                            .then((data) => {
                                if (data) {
                                    const newChat = this.transChatRecords(data);
                                    const {
                                        chatId,
                                        originalChat
                                    } = newChat;
                                    this.setState({
                                        chatId,
                                        originalChat
                                    });
                                }
                            })
                            .catch((error) =>
                                this.setState({ error, isLoading: false })
                            );
                    }
                }
            );
            this.setState({
                value: '',
            });
        }, 1000);
    };

    handleChange = (e) => {
        this.setState({
            value: e.target.value,
        });
    };

    renderOnlineBookingCard = (onlineBooking) => {
        const { searchValue } = this.state;
        if (onlineBooking.length) {
            //TODO improve Search Filter
            if (searchValue) {
                const result = onlineBooking.filter((booking) => {
                    return (
                        booking.userId.firstName === searchValue ||
                        booking.userId.lastName === searchValue ||
                        booking.topic === searchValue ||
                        booking.subject === searchValue ||
                        booking.content === searchValue
                    );
                });
                return result.map((booking) => {
                    return (
                        <BookingCard
                            key={booking._id}
                            bookingId={booking._id}
                            firstName={booking.userId.firstName}
                            lastName={booking.userId.lastName}
                            subject={booking.subject}
                            status={booking.status}
                            handleClickBooking={this.handleClickBooking}
                        />
                    );
                });
            } else {
                return onlineBooking.map((booking) => {
                    return (
                        <BookingCard
                            key={booking._id}
                            bookingId={booking._id}
                            firstName={booking.userId.firstName}
                            lastName={booking.userId.lastName}
                            subject={booking.subject}
                            status={booking.status}
                            handleClickBooking={this.handleClickBooking}
                        />
                    );
                });
            }
        }
    };

    renderOfflineBookingCard = (offlineBooking) => {
        const { searchValue } = this.state;
        if (offlineBooking.length) {
            // Search Filter
            if (searchValue) {
                const result = offlineBooking.filter((booking) => {
                    return (
                        booking.userId.firstName === searchValue ||
                        booking.userId.lastName === searchValue ||
                        booking.topic === searchValue ||
                        booking.subject === searchValue ||
                        booking.content === searchValue
                    );
                });
                return result.map((booking) => {
                    return (
                        <BookingCard
                            key={booking._id}
                            bookingId={booking._id}
                            firstName={booking.userId.firstName}
                            lastName={booking.userId.lastName}
                            subject={booking.subject}
                            status={booking.status}
                            handleClickBooking={this.handleClickBooking}
                        />
                    );
                });
            } else {
                return offlineBooking.map((booking) => {
                    return (
                        <BookingCard
                            key={booking._id}
                            bookingId={booking._id}
                            firstName={booking.userId.firstName}
                            lastName={booking.userId.lastName}
                            subject={booking.subject}
                            status={booking.status}
                            handleClickBooking={this.handleClickBooking}
                        />
                    );
                });
            }
        }
    };

    renderOnlineBookingDetail = (bookingDetail) => {
        const { submitting, value, comments } = this.state;
        const {
            _id,
            status,
            type,
            campus,
            userId,
            topic,
            subject,
            content,
            bookingDate,
            attachment
        } = bookingDetail;
        const date = moment(bookingDate).format('MMMM Do YYYY, h:mm:ss');
        return (
            <div>
                <Descriptions
                    title={`Booking Detail - ${_id}`}
                    bordered
                    column={{ xxl: 3, xl: 3, lg: 3, md: 3, sm: 2, xs: 1 }}
                >
                    <Descriptions.Item label='Name'>
                        {userId ? `${userId.firstName} ${userId.lastName}` : ''}
                    </Descriptions.Item>
                    <Descriptions.Item label='Campus'>
                        {campus}
                    </Descriptions.Item>
                    <Descriptions.Item label='Booking Date'>
                        {date}
                    </Descriptions.Item>
                    <Descriptions.Item label='Topic'>{topic}</Descriptions.Item>
                    <Descriptions.Item label='Subject'>
                        {subject}
                    </Descriptions.Item>
                    <Descriptions.Item label='Status'>
                        {status}
                    </Descriptions.Item>
                    <Descriptions.Item label='Content' span={3}>
                        <div
                            dangerouslySetInnerHTML={{
                                __html: content,
                            }}
                        ></div>
                    </Descriptions.Item>
                    <Descriptions.Item label='Attachment'>
                        {attachment
                            ? attachment.map((item) => {
                                  const { _id, fileName, fileLocation } = item;
                                  return (
                                      <div key={_id} className='l-download'>
                                          <p>{fileName}</p>
                                          <Button
                                              type='primary'
                                              icon={<DownloadOutlined />}
                                              size='small'
                                              target='_blank'
                                              download
                                              href={fileLocation}
                                          >
                                              Download
                                          </Button>
                                      </div>
                                  );
                              })
                            : null}
                    </Descriptions.Item>
                </Descriptions>
                <div>
                    {comments.length > 0 && <CommentList comments={comments} />}
                    <Comment
                        avatar={
                            <Avatar
                                src='https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png'
                                alt='Han Solo'
                            />
                        }
                        content={
                            <Editor
                                onChange={this.handleChange}
                                onSubmit={this.handleSubmit}
                                submitting={submitting}
                                value={value}
                            />
                        }
                    />
                </div>
            </div>
        );
    };

    renderOfflineBookingDetail = (bookingDetail) => {
        const { submitting, value, comments } = this.state;
        const {
            _id,
            status,
            campus,
            userId,
            topic,
            subject,
            content,
            bookingDate,
            attachment,
        } = bookingDetail;
        const date = moment(bookingDate).format('MMMM Do YYYY, h:mm:ss');

        return (
            <div>
                <Descriptions
                    title={`Booking Detail - ${_id}`}
                    bordered
                    column={{ xxl: 3, xl: 3, lg: 3, md: 3, sm: 2, xs: 1 }}
                >
                    <Descriptions.Item label='Name'>
                        {userId ? `${userId.firstName} ${userId.lastName}` : ''}
                    </Descriptions.Item>
                    <Descriptions.Item label='Campus'>
                        {campus}
                    </Descriptions.Item>
                    <Descriptions.Item label='Booking Date'>
                        {date}
                    </Descriptions.Item>
                    <Descriptions.Item label='Topic'>{topic}</Descriptions.Item>
                    <Descriptions.Item label='Subject'>
                        {subject}
                    </Descriptions.Item>
                    <Descriptions.Item label='Status'>
                        {status}
                    </Descriptions.Item>
                    <Descriptions.Item label='Content' span={3}>
                        {content}
                    </Descriptions.Item>
                    <Descriptions.Item label='Attachment'>
                        {attachment
                            ? attachment.map((item) => {
                                  const { _id, fileName, fileLocation } = item;
                                  return (
                                      <div key={_id} className='l-download'>
                                          <p>{fileName}</p>
                                          <Button
                                              type='primary'
                                              icon={<DownloadOutlined />}
                                              size='small'
                                              target='_blank'
                                              download
                                              href={fileLocation}
                                          >
                                              Download
                                          </Button>
                                      </div>
                                  );
                              })
                            : null}
                    </Descriptions.Item>
                </Descriptions>
                <div>
                    {comments.length > 0 && <CommentList comments={comments} />}
                    <Comment
                        avatar={
                            <Avatar
                                src='https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png'
                                alt='Han Solo'
                            />
                        }
                        content={
                            <Editor
                                onChange={this.handleChange}
                                onSubmit={this.handleSubmit}
                                submitting={submitting}
                                value={value}
                            />
                        }
                    />
                </div>
            </div>
        );
    };

    renderBookingCard = (onlineBooking, offlineBooking) => {
        return this.state.activeTab === 'online'
            ? this.renderOnlineBookingCard(onlineBooking)
            : this.renderOfflineBookingCard(offlineBooking);
    };

    renderBookingDetail = (bookingDetail) => {
        return this.state.activeTab === 'online'
            ? this.renderOnlineBookingDetail(bookingDetail)
            : this.renderOfflineBookingDetail(bookingDetail);
    };

    render() {
        const { bookings, bookingDetail } = this.props;
        const { activeBooking } = this.state;
        let onlineBooking = [];
        let offlineBooking = [];
        if (bookings) {
            onlineBooking = bookings.filter((booking) => {
                return booking.type === 'Online';
            });
            offlineBooking = bookings.filter((booking) => {
                return booking.type === 'Offline';
            });
        }
        const { activeTab } = this.state;
        const offlineTabClass =
            activeTab === 'offline'
                ? 'c-tabbar__link c-tabbar__link--active'
                : 'c-tabbar__link';
        const onlineTabClass =
            activeTab === 'online'
                ? 'c-tabbar__link c-tabbar__link--active'
                : 'c-tabbar__link';
        return (
            <div className='l-admin-container'>
                <div className='c-tabbar'>
                    <ul className='c-tabbar__menu'>
                        <li className='c-tabbar__item'>
                            <a
                                className={onlineTabClass}
                                id='online'
                                onClick={this.changeTabKey}
                            >
                                Online Booking
                            </a>
                        </li>
                        <li className='c-tabbar__item'>
                            <a
                                className={offlineTabClass}
                                id='offline'
                                onClick={this.changeTabKey}
                            >
                                Face To Face Booking
                            </a>
                        </li>
                    </ul>
                </div>
                <div className='l-admin-wrapper'>
                    <Row>
                        <Col span={8}>
                            <div className='c-sidemenu'>
                                <div className='c-sidemenu__search'>
                                    <Search
                                        placeholder='Search'
                                        onSearch={(value) =>
                                            this.searchBooking(value)
                                        }
                                    />
                                </div>
                                <div className='c-sidemenu__content'>
                                    {this.renderBookingCard(
                                        onlineBooking,
                                        offlineBooking
                                    )}
                                </div>
                            </div>
                        </Col>
                        <Col span={16}>
                            <div className='l-admin__content'>
                                {bookingDetail && activeBooking
                                    ? this.renderBookingDetail(bookingDetail)
                                    : null}
                            </div>
                        </Col>
                    </Row>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    bookings: state.booking.bookings,
    bookingDetail: state.booking.bookingDetail,
    firstName: state.user.firstName,
    lastName: state.user.lastName,
});

const mapDispatchToProps = (dispatch) => ({
    getAllBookings: () => dispatch(fetchAllBookingThunkAction()),
    getBookingDetail: (bookingId) =>
        dispatch(fetchBookingDetailThunkAction(bookingId)),
    fetchUserDetail: (userId) => dispatch(fetchUserDetailThunkAction(userId)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Admin);
