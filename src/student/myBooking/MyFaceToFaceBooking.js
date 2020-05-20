import React from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import { Input, Comment, Empty, Avatar, Form, Button, List, Modal } from 'antd';
import BookingCard from './components/BookingCard';
import {
    fetchBookingDetailThunkAction,
    fetchBookingThunkAction,
    updateStatusThunkAction,
} from '../../redux/actions/bookingAction';
import { fetchUserDetailThunkAction } from '../../redux/actions/userAction';
import { fetchUserId } from '../../utils/authentication';
import {
    addChat,
    updateChat,
    fetchAllChatByBookingId,
} from '../../utils/api/booking';
import { DownloadOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import './styles/myFaceToFaceBooking.scss';

const { TextArea } = Input;
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

class MyFaceToFaceBooking extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            userId: '',
            submitting: false,
            value: '',
            searchValue: '',
            activeCard: false,
            currentBookingId: '',
            error: null,
            isLoading: false,
            comments: [], //chatRecord for frontend
            chatId: '',
            originalChat: [], //chatRecord in database
        };
    }

    componentDidMount() {
        this.getMyBooking();
    }

    getMyBooking = () => {
        const { fetchMyBooking, fetchUserDetail } = this.props;
        const userId = fetchUserId();
        fetchMyBooking(userId);
        this.setState({ userId }, () => {
            fetchUserDetail(userId);
        });
    };

    searchBooking = (value) => {
        this.setState({ searchValue: value });
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
            activeCard: true,
            currentBookingId: bookingId,
            value: '',
        });
    };

    handleSubmit = () => {
        if (!this.state.value) {
            return;
        }

        this.setState({
            submitting: true,
        });

        setTimeout(() => {
            const { firstName, lastName } = this.props;
            const {
                chatId,
                originalChat,
                userId,
                currentBookingId,
                value,
            } = this.state;
            const author = `${firstName} ${lastName}`;
            this.setState(
                () => ({
                    submitting: false,
                    value: '',
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
                    const Msg = {
                        author: userId,
                        content: value,
                        time: new Date(),
                    };
                    if (!chatId) {
                        // Create a new Chat
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
                        // update existing Chat
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
                                this.setState({
                                    error,
                                    isLoading: false,
                                })
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

    renderOnlineBookingCard = (myOfflineBookings) => {
        const { searchValue, currentBookingId } = this.state;
        if (myOfflineBookings.length) {
            // Search Filter
            if (searchValue) {
                const result = myOfflineBookings.filter((booking) => {
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
                return myOfflineBookings.map((booking) => {
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
        }
    };

    renderBookingDetail = (bookingDetail) => {
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
        let canCancel = false;
        console.log(status);
        if (bookingDate) {
            const now = new Date().getTime();
            const bookDate = new Date(bookingDate).getTime();
            if (
                bookDate - now > 86400000 &&
                (status === 'pending' || status === 'accepted')
            ) {
                canCancel = true;
            }
        }

        return (
            <div>
                <div className='l-admin__header'>
                    <p className='l-admin__title'>{`Booking Number - ${bookingNum}`}</p>
                    <div className='l-admin__action'>
                        {canCancel ? (
                            <Button onClick={this.handleCancel}>Cancel</Button>
                        ) : null}
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
                    <div></div>
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

    render() {
        const { bookings, bookingDetail } = this.props;
        const { activeCard } = this.state;

        const { Search } = Input;
        const myOfflineBookings = bookings.filter((booking) => {
            return booking.type === 'Offline';
        });

        return (
            <main className='mybooking'>
                <section className='mybooking__left'>
                    <h2 className='mybooking__title'>Booking List</h2>
                    <Search
                        placeholder='input search text'
                        onSearch={(value) => this.searchBooking(value)}
                        enterButton='Search'
                        size='large'
                    />
                    <div className='list-group'>
                        {myOfflineBookings.length ? (
                            this.renderOnlineBookingCard(myOfflineBookings)
                        ) : (
                            <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
                        )}
                    </div>
                </section>
                <section className='mybooking__right'>
                    <div className='tab-content'>
                        {bookingDetail && activeCard
                            ? this.renderBookingDetail(bookingDetail)
                            : null}
                    </div>
                </section>
            </main>
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
    getBookingDetail: (bookingId) =>
        dispatch(fetchBookingDetailThunkAction(bookingId)),
    fetchMyBooking: (userId) => dispatch(fetchBookingThunkAction(userId)),
    fetchUserDetail: (userId) => dispatch(fetchUserDetailThunkAction(userId)),
    updateStatus: (currentBookingId, status) =>
        dispatch(updateStatusThunkAction(currentBookingId, status)),
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(MyFaceToFaceBooking);
