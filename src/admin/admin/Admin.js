import React, { Fragment } from 'react';
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
    Drawer,
    Divider,
    Select,
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
    fetchAllMyBookings,
} from '../../utils/api/booking';
import { orderBy, capitalize } from 'lodash';
import { DownloadOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { ONLINE_BOOKING_STATUS, OFFLINE_BOOKING_STATUS } from '../../constants/option';
import AvatarLogo from '../../assets/icon/avatar.png';
import './admin.scss';

const { Search, TextArea } = Input;
const { confirm } = Modal;
const { Option } = Select;

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

const DescriptionItem = ({ title, content }) => (
    <div className="site-description-item-profile-wrapper">
      <p className="site-description-item-profile-p-label">{title}:</p>
      {content}
    </div>
  );

class Admin extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            filterTab: 'all',
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
            visible: false,
            childrenDrawer: false,
            userBookingHistory: []
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

    showDrawer = () => {
        this.setState({
          visible: true,
        });
      };
    
      onClose = () => {
        this.setState({
          visible: false,
        });
      };

    changeTabKey = (event) => {
        const activeTab = event.target.id;
        this.setState({
            activeTab,
            activeBooking: false,
        });
    };

    handleFilter = (value) => {
        const filterTab = value;
        console.log(filterTab);
        this.setState({
            filterTab,
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
        const status = OFFLINE_BOOKING_STATUS.ACCEPTED;
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
        const status = OFFLINE_BOOKING_STATUS.CANCELED;
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
        const status = ONLINE_BOOKING_STATUS.FINISHED;
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
                    avatar: AvatarLogo,
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
                        ...this.state.comments,
                        {
                            author,
                            avatar: AvatarLogo,
                            content: value,
                            datetime: moment().fromNow(),
                        }
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

  // renderOnline booking card
    renderOnlineBookingCard = (onlineBooking) => {
        const { searchValue, currentBookingId } = this.state;
        if (onlineBooking.length) {
            //TODO improve Search Filter
            if (searchValue) {
                const result = onlineBooking.filter((booking) => {
                    return (
                        booking.userId.firstName === searchValue ||
                        booking.userId.lastName === searchValue ||
                        booking.userId.studentId === searchValue ||
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
                            studentId={booking.userId.studentId}
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
                            studentId={booking.userId.studentId}
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

//render online pending booking card
renderOnlineProcessingBookingCard = (onlineProcessingBooking) => {
    const { searchValue, currentBookingId } = this.state;
    if (onlineProcessingBooking.length) {
        //TODO improve Search Filter
        if (searchValue) {
            const result = onlineProcessingBooking.filter((booking) => {
                return (
                    booking.userId.firstName === searchValue ||
                    booking.userId.lastName === searchValue ||
                    booking.userId.studentId === searchValue ||
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
                        studentId={booking.userId.studentId}
                        topic={booking.topic}
                        status={booking.status}
                        handleClickBooking={this.handleClickBooking}
                        currentBookingId={currentBookingId}
                    />
                );
            });
        } else {
            return onlineProcessingBooking.map((booking) => {
                return (
                    <BookingCard
                        key={booking._id}
                        bookingId={booking._id}
                        firstName={booking.userId.firstName}
                        lastName={booking.userId.lastName}
                        studentId={booking.userId.studentId}
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

//render offline booking card
    renderOfflineBookingCard = (offlineBooking) => {
        const { searchValue, currentBookingId } = this.state;
        if (offlineBooking.length) {
            // Search Filter
            if (searchValue) {
                const result = offlineBooking.filter((booking) => {
                    return (
                        booking.userId.firstName === searchValue ||
                        booking.userId.lastName === searchValue ||
                        booking.userId.studentId === searchValue ||
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
                            studentId={booking.userId.studentId}
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
                            studentId={booking.userId.studentId}
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
//render offline pending booking card
    renderOfflinePendingBookingCard = (offlinePendingBooking) => {
        const { searchValue, currentBookingId } = this.state;
        if (offlinePendingBooking.length) {
            // Search Filter
            if (searchValue) {
                const result = offlinePendingBooking.filter((booking) => {
                    return (
                        booking.userId.firstName === searchValue ||
                        booking.userId.lastName === searchValue ||
                        booking.userId.studentId === searchValue ||
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
                            studentId={booking.userId.studentId}
                            topic={booking.topic}
                            status={booking.status}
                            handleClickBooking={this.handleClickBooking}
                            currentBookingId={currentBookingId}
                        />
                    );
                });
            } else {
                return offlinePendingBooking.map((booking) => {
                    return (
                        <BookingCard
                            key={booking._id}
                            bookingId={booking._id}
                            firstName={booking.userId.firstName}
                            lastName={booking.userId.lastName}
                            studentId={booking.userId.studentId}
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
            status,
            campus,
            userId,
            subject,
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
                            <div className='c-table__content c-table__content-name'>
                                <p>
                                    {userId
                                        ? `${userId.firstName} ${userId.lastName}`
                                        : ''}
                                </p>
                                <a onClick={this.showDrawer}>View Profile</a>
                            </div>
                        </div>
                        <div className='c-table__column flex-1'>
                            <span>Campus</span>
                            <div className='c-table__content'>
                                <p>{capitalize(campus)}</p>
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
                            <span>Subject</span>
                            <div className='c-table__content'>
                                <p>{capitalize(subject)}</p>
                            </div>
                        </div>
                        <div className='c-table__column flex-1'>
                            <span>Status</span>
                            <div className='c-table__content'>
                                <p>{capitalize(status)}</p>
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

                <div className='l-admin__comment'>
                    {comments.length > 0 && <CommentList comments={comments} />}
                    <Comment
                        avatar={
                            <Avatar
                                src={AvatarLogo}
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
            case OFFLINE_BOOKING_STATUS.PENDING:
                return (
                    <div>
                        <Button onClick={this.handleConfirm}>Accept</Button>
                        <Button onClick={this.handleCancel}>Reject</Button>
                    </div>
                );
            case OFFLINE_BOOKING_STATUS.ACCEPTED:
                return <Button onClick={this.handleCancel}>Cancel</Button>;
            case ONLINE_BOOKING_STATUS.PROCESSING:
                return <Button onClick={this.handleFinish}>Finish</Button>;
            default:
                return null;
        }
    };

    renderOfflineBookingDetail = (bookingDetail) => {
        const { submitting, value, comments } = this.state;
        const {
            bookingNum,
            status,
            campus,
            userId,
            subject,
            content,
            bookingDate,
            bookingTime,
            attachment,
        } = bookingDetail;
        const date = moment(bookingDate).format('MMMM Do YYYY');
        const time = `${date} ${bookingTime}:00 - ${bookingTime}:50`;

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
                            <div className='c-table__content c-table__content-name'>
                                <p>
                                    {userId
                                        ? `${userId.firstName} ${userId.lastName}`
                                        : ''}
                                </p>
                                <a onClick={this.showDrawer}>View Profile</a>
                            </div>
                        </div>
                        <div className='c-table__column flex-1'>
                            <span>Campus</span>
                            <div className='c-table__content'>
                                <p>{capitalize(campus)}</p>
                            </div>
                        </div>
                    </div>
                    <div className='c-table__row'>
                        <div className='c-table__column flex-1'>
                            <span>Booking Date</span>
                            <div className='c-table__content'>
                                <p>{time}</p>
                            </div>
                        </div>
                        <div className='c-table__column flex-2'>
                            <span>Subject</span>
                            <div className='c-table__content'>
                                <p>{capitalize(subject)}</p>
                            </div>
                        </div>
                        <div className='c-table__column flex-1'>
                            <span>Status</span>
                            <div className='c-table__content'>
                                <p>{capitalize(status)}</p>
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
                <div className='l-admin__comment'>
                    {comments.length > 0 && <CommentList comments={comments} />}
                    <Comment
                        avatar={
                            <Avatar
                                src={AvatarLogo}
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

    renderBookingCard = (onlineBooking, offlineBooking, onlineProcessingBooking, offlinePendingBooking ) => {

        if (this.state.activeTab === 'online' & this.state.filterTab === 'all') {
            return  this.renderOnlineBookingCard(onlineBooking);
        }   
        else if (this.state.activeTab === 'offline' & this.state.filterTab === 'all'){
            return  this.renderOfflineBookingCard(offlineBooking);
        }
        else if (this.state.activeTab === 'online' & this.state.filterTab === 'pending'){
            return this.renderOnlineProcessingBookingCard(onlineProcessingBooking);
        }
        else {
            return this.renderOfflinePendingBookingCard(offlinePendingBooking);
        }
    };

    renderBookingDetail = (bookingDetail) => {
        return this.state.activeTab === 'online'
            ? this.renderOnlineBookingDetail(bookingDetail)
            : this.renderOfflineBookingDetail(bookingDetail);
    };

    showChildrenDrawer = (userId) => {
        fetchAllMyBookings(userId)
        .then(data => {
            this.setState(() => { 
                return {userBookingHistory: data};});
        })
        .catch(error => {
            this.setState({ error });
        }); 
        this.setState({
            childrenDrawer: true,
        });
    };
    
    onChildrenDrawerClose = () => {

        this.setState({
            childrenDrawer: false,
        });
    };

    renderViewProfile = (bookingDetail) => {
        const { userBookingHistory } = this.state;
        let bookingArray = [];
        if(userBookingHistory) {
            bookingArray = orderBy(userBookingHistory, ['bookingDate'], ['desc']);
        }
        if(bookingDetail.userId) {
            const { firstName, lastName, studentId, gender, phone, campus, email, _id: userId } = bookingDetail.userId;
            return (
                <Drawer
                title="User Profile"
                placement="right"
                closable={true}
                onClose={this.onClose}
                visible={this.state.visible}
                >
                    <p className="site-description-item-profile-p">Personal</p>
                    <Row>
                        <Col span={12}>
                            <DescriptionItem title="Full Name" content={`${firstName} ${lastName}`} />
                        </Col>
                        <Col span={12}>
                            <DescriptionItem title="Student ID" content={studentId} />
                        </Col>
                    </Row>
                    <Row>
                        <Col span={12}>
                            <DescriptionItem title="Gender" content={capitalize(gender)} />
                        </Col>
                        <Col span={12}>
                            <DescriptionItem title="Campus" content={capitalize(campus)} />
                        </Col>
                    </Row>
                    <Divider />
                    <p className="site-description-item-profile-p">Contacts</p>
                    <Row>
                        <Col span={12}>
                            <DescriptionItem title="Phone Number" content={phone} />
                        </Col>
                        <Col span={12}>
                            <DescriptionItem title="Email" content={email} />
                        </Col>
                    </Row>
                    <Divider />
                    <Button type="primary" onClick={() => this.showChildrenDrawer(userId)}>
                        Booking History
                    </Button>
                    <Drawer
                        title="Booking History"
                        width={320}
                        closable={true}
                        onClose={this.onChildrenDrawerClose}
                        visible={this.state.childrenDrawer}
                    >
                        {userBookingHistory ? (
                                    bookingArray.map(item => {
                                        const { bookingNum, topic, type, bookingDate, status } = item;
                                        return (
                                            <Fragment key={bookingNum}>
                                                <p className="site-description-item-profile-p">{`Booking Number: ${bookingNum}`}</p>
                                                <Row>
                                                    <Col span={12}>
                                                        <DescriptionItem title="Topic" content={capitalize(topic)} />
                                                    </Col>
                                                    <Col span={12}>
                                                        <DescriptionItem title="Type" content={capitalize(type)} />
                                                    </Col>
                                                </Row>
                                                <Row>
                                                    <Col span={12}>
                                                        <DescriptionItem title="Date" content={moment(bookingDate).format('YYYY-MM-DD')} />
                                                    </Col>
                                                    <Col span={12}>
                                                        <DescriptionItem title="Status" content={capitalize(status)} />
                                                    </Col>
                                                </Row>
                                                <Divider />
                                            </Fragment>
                                        );
                                    })
                        ) : null }
                    </Drawer>
                </Drawer>
            );
        }
        return null;
    }

    render() {
        const { bookings, bookingDetail } = this.props;

        const { activeBooking } = this.state;
        let onlineBooking = [];
        let offlineBooking = [];
        let onlineProcessingBooking = [];
        let offlinePendingBooking = [];
        if (bookings) {
            onlineBooking = bookings.filter((booking) => {
                return booking.type === 'online';
            });
            onlineProcessingBooking = bookings.filter((onlineBooking) => {
                return onlineBooking.status === 'processing';
            });
            
            offlineBooking = bookings.filter((booking) => {
                return booking.type === 'offline';
            });
            offlinePendingBooking = bookings.filter((offlineBooking) => {
                return offlineBooking.status === 'pending';
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
                                    <Select defaultValue="all" onChange={this.handleFilter}>
                                        <Option value="pending">Pending</Option>
                                        <Option value="all">ALL</Option>
                                    </Select>
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
                                        offlineBooking,
                                        onlineProcessingBooking,
                                        offlinePendingBooking
                                    )}
                                </div>
                            </div>
                        </Col>
                        <Col span={18}>
                            <div className='l-admin__content'>
                                {bookingDetail.userId && activeBooking
                                    ? this.renderBookingDetail(bookingDetail)
                                    : null}
                            </div>
                        </Col>
                    </Row>
                </div>
                {bookingDetail && activeBooking
                    ? this.renderViewProfile(bookingDetail)
                    : null}
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
