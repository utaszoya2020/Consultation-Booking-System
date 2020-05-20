import React from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import {
    Row,
    Col,
    Input,
    Button,
    Comment,
    Avatar,
    List,
    Form,
    Modal,
    Empty,
} from 'antd';
import BookingCard from '../../student/myBooking/components/BookingCard';
import { fetchUserId } from '../../utils/authentication';
import {
    fetchAllBookingThunkAction,
    fetchBookingDetailThunkAction,
    updateStatusThunkAction,
} from '../../redux/actions/bookingAction';
import { fetchUserDetailThunkAction } from '../../redux/actions/userAction';
import {
    addChat,
    updateChat,
    fetchAllChatByBookingId,
} from '../../utils/api/booking';
import { DownloadOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import './admin.scss';

const { Search, TextArea } = Input;
const { confirm } = Modal;

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
            currentBookingId: '',
            activeBooking: false,
            submitting: false,
            value: '',
            chatId: '',
            originalChat: [], //chatRecord in database
            comments: [],
            error: null,
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
            activeBooking: false,
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

    handleConfirm = () => {
        const { currentBookingId } = this.state;
        const { updateStatus } = this.props;
        const status = 'accepted';
        confirm({
            title: 'Do you want to accept these booking?',
            icon: <ExclamationCircleOutlined />,
            content:
                'When clicked the OK button, this booking will be accepted',
            onOk() {
                return new Promise((resolve, reject) => {
                    updateStatus(currentBookingId, status)
                        .then(() => {
                            resolve();
                        })
                        .catch((error) => {
                            reject(error);
                        });
                }).catch(() => console.log('Oops errors!'));
            },
            onCancel() {},
        });
    };

    handleCancel = () => {
        const { currentBookingId } = this.state;
        const { updateStatus } = this.props;
        const status = 'canceled';
        confirm({
            title: 'Do you want to cancel these booking?',
            icon: <ExclamationCircleOutlined />,
            content:
                'When clicked the OK button, this booking will be canceled',
            onOk() {
                return new Promise((resolve, reject) => {
                    updateStatus(currentBookingId, status)
                        .then(() => {
                            resolve();
                        })
                        .catch((error) => {
                            reject(error);
                        });
                }).catch(() => console.log('Oops errors!'));
            },
            onCancel() {},
        });
    };

    handleFinish = () => {
        const { currentBookingId } = this.state;
        const { updateStatus } = this.props;
        const status = 'finished';
        confirm({
            title: 'Do you want to finish these booking?',
            icon: <ExclamationCircleOutlined />,
            content:
                'When clicked the OK button, this booking will be finished',
            onOk() {
                return new Promise((resolve, reject) => {
                    updateStatus(currentBookingId, status)
                        .then(() => {
                            resolve();
                        })
                        .catch((error) => {
                            reject(error);
                        });
                }).catch(() => console.log('Oops errors!'));
            },
            onCancel() {},
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
                                    const { chatId, originalChat } = newChat;
                                    this.setState({
                                        chatId,
                                        originalChat,
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
                                    const { chatId, originalChat } = newChat;
                                    this.setState({
                                        chatId,
                                        originalChat,
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
        const { searchValue, currentBookingId } = this.state;
        if (onlineBooking.length) {
            //TODO improve Search Filter
            if (searchValue) {
                const result = onlineBooking.filter((booking) => {
                    return (
                        booking.userId.firstName === searchValue ||
                        booking.userId.lastName === searchValue ||
                        booking.topic === searchValue ||
                        booking.content === searchValue ||
                        booking.bookingNum === searchValue ||
                        booking.status === searchValue
                    );
                });
                return result.map((booking) => {
                    return (
                        <BookingCard
                            key={booking._id}
                            bookingId={booking._id}
                            firstName={booking.userId.firstName}
                            lastName={booking.userId.lastName}
                            topic={booking.topic}
                            status={booking.status}
                            handleClickBooking={this.handleClickBooking}
                            currentBookingId={currentBookingId}
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
                            topic={booking.topic}
                            status={booking.status}
                            handleClickBooking={this.handleClickBooking}
                            currentBookingId={currentBookingId}
                        />
                    );
                });
            }
        } else {
            return <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />;
        }
    };

    renderOfflineBookingCard = (offlineBooking) => {
        const { searchValue, currentBookingId } = this.state;
        if (offlineBooking.length) {
            // Search Filter
            if (searchValue) {
                const result = offlineBooking.filter((booking) => {
                    return (
                        booking.userId.firstName === searchValue ||
                        booking.userId.lastName === searchValue ||
                        booking.topic === searchValue ||
                        booking.content === searchValue ||
                        booking.bookingNum === searchValue ||
                        booking.status === searchValue
                    );
                });
                return result.map((booking) => {
                    return (
                        <BookingCard
                            key={booking._id}
                            bookingId={booking._id}
                            firstName={booking.userId.firstName}
                            lastName={booking.userId.lastName}
                            topic={booking.topic}
                            status={booking.status}
                            handleClickBooking={this.handleClickBooking}
                            currentBookingId={currentBookingId}
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
                            topic={booking.topic}
                            status={booking.status}
                            handleClickBooking={this.handleClickBooking}
                            currentBookingId={currentBookingId}
                        />
                    );
                });
            }
        } else {
            return <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />;
        }
    };

    renderOnlineBookingDetail = (bookingDetail) => {
        const { submitting, value, comments } = this.state;
        const {
            _id,
            status,
            campus,
            userId,
            topic,
            content,
            bookingDate,
            attachment,
            bookingNum,
        } = bookingDetail;

        const date = moment(bookingDate).format('MMMM Do YYYY, hh:mm a');
        return (
            <div>
                <div className='l-admin__header'>
                    <p className='l-admin__title'>{`Booking Number - ${bookingNum}`}</p>
                    <div className='l-admin__action'>
                        {this.renderActionBtn(status)}
                    </div>
                </div>
                <div className='c-table'>
                    <div className='c-table__row'>
                        <div className='c-table__column flex-1'>
                            <span>ID Number</span>
                            <div className='c-table__content'>
                                <p>453654</p>
                            </div>
                        </div>
                        <div className='c-table__column flex-2'>
                            <span>Name</span>
                            <div className='c-table__content'>
                                <p>
                                    {userId
                                        ? `${userId.firstName} ${userId.lastName}`
                                        : ''}
                                </p>
                            </div>
                        </div>
                        <div className='c-table__column flex-1'>
                            <span>Campus</span>
                            <div className='c-table__content'>
                                <p>{campus}</p>
                            </div>
                        </div>
                    </div>
                    <div className='c-table__row'>
                        <div className='c-table__column flex-1'>
                            <span>Booking Date</span>
                            <div className='c-table__content'>
                                <p>{date}</p>
                            </div>
                        </div>
                        <div className='c-table__column flex-2'>
                            <span>Topic</span>
                            <div className='c-table__content'>
                                <p>{topic}</p>
                            </div>
                        </div>
                        <div className='c-table__column flex-1'>
                            <span>Status</span>
                            <div className='c-table__content'>
                                <p>{status}</p>
                            </div>
                        </div>
                    </div>
                    <div className='c-table__row'>
                        <div className='c-table__column flex-1'>
                            <span>Current Course</span>
                            <div className='c-table__content'>
                                <p>MICT</p>
                            </div>
                        </div>
                    </div>
                    <div className='c-table__row'>
                        <div className='c-table__column flex-1'>
                            <span>Content</span>
                            <div className='c-table__content'>
                                <div
                                    dangerouslySetInnerHTML={{
                                        __html: content,
                                    }}
                                ></div>
                            </div>
                        </div>
                    </div>
                    <div className='c-table__row'>
                        <div className='c-table__column flex-1'>
                            <span>Attachment</span>
                            <div className='c-table__content'>
                                {attachment ? (
                                    attachment.map((item) => {
                                        const {
                                            _id,
                                            fileName,
                                            fileLocation,
                                        } = item;
                                        return (
                                            <div
                                                key={_id}
                                                className='l-admin__download'
                                            >
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
                                ) : (
                                    null
                                )}
                            </div>
                        </div>
                    </div>
                </div>

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

    renderActionBtn = (status) => {
        switch (status) {
            case 'pending':
                return <Button onClick={this.handleConfirm}>Accept</Button>;
            case 'accepted':
                return <Button onClick={this.handleCancel}>Cancel</Button>;
            case 'processing':
                return <Button onClick={this.handleFinish}>Finish</Button>;
            default:
                return null;
        }
    };

    renderOfflineBookingDetail = (bookingDetail) => {
        const { submitting, value, comments } = this.state;
        const {
            _id,
            bookingNum,
            status,
            campus,
            userId,
            topic,
            content,
            bookingDate,
            attachment,
        } = bookingDetail;
        console.log(status);
        const date = moment(bookingDate).format('MMMM Do YYYY, hh:mm a');
        //TODO

        return (
            <div>
                <div className='l-admin__header'>
                    <p className='ant-descriptions-title'>{`Booking Detail - ${bookingNum}`}</p>
                    <div className='l-admin__action'>
                        {this.renderActionBtn(status)}
                    </div>
                </div>
                <div className='c-table'>
                    <div className='c-table__row'>
                        <div className='c-table__column flex-1'>
                            <span>ID Number</span>
                            <div className='c-table__content'>
                                <p>453654</p>
                            </div>
                        </div>
                        <div className='c-table__column flex-2'>
                            <span>Name</span>
                            <div className='c-table__content'>
                                <p>
                                    {userId
                                        ? `${userId.firstName} ${userId.lastName}`
                                        : ''}
                                </p>
                            </div>
                        </div>
                        <div className='c-table__column flex-1'>
                            <span>Campus</span>
                            <div className='c-table__content'>
                                <p>{campus}</p>
                            </div>
                        </div>
                    </div>
                    <div className='c-table__row'>
                        <div className='c-table__column flex-1'>
                            <span>Booking Date</span>
                            <div className='c-table__content'>
                                <p>{date}</p>
                            </div>
                        </div>
                        <div className='c-table__column flex-2'>
                            <span>Topic</span>
                            <div className='c-table__content'>
                                <p>{topic}</p>
                            </div>
                        </div>
                        <div className='c-table__column flex-1'>
                            <span>Status</span>
                            <div className='c-table__content'>
                                <p>{status}</p>
                            </div>
                        </div>
                    </div>
                    <div className='c-table__row'>
                        <div className='c-table__column flex-1'>
                            <span>Current Course</span>
                            <div className='c-table__content'>
                                <p>MICT</p>
                            </div>
                        </div>
                    </div>
                    <div className='c-table__row'>
                        <div className='c-table__column flex-1'>
                            <span>Content</span>
                            <div className='c-table__content'>
                                <div
                                    dangerouslySetInnerHTML={{
                                        __html: content,
                                    }}
                                ></div>
                            </div>
                        </div>
                    </div>
                    <div className='c-table__row'>
                        <div className='c-table__column flex-1'>
                            <span>Attachment</span>
                            <div className='c-table__content'>
                                {attachment
                                    ? attachment.map((item) => {
                                          const {
                                              _id,
                                              fileName,
                                              fileLocation,
                                          } = item;
                                          return (
                                              <div
                                                  key={_id}
                                                  className='l-admin__download'
                                              >
                                                  <p>{fileName}</p>
                                                  <Button
                                                      type='primary'
                                                      icon={
                                                          <DownloadOutlined />
                                                      }
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
                            </div>
                        </div>
                    </div>
                </div>
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
                        <Col span={6}>
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
                        <Col span={18}>
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
    updateStatus: (currentBookingId, status) =>
        dispatch(updateStatusThunkAction(currentBookingId, status)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Admin);
