import React from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import { Row, Col, Input, Descriptions } from 'antd';
import BookingCard from '../../student/myBooking/components/BookingCard';
import {
    fetchAllBookingThunkAction,
    fetchBookingDetailThunkAction,
} from '../../redux/actions/bookingAction';
import './admin.scss';

const { Search } = Input;

class Admin extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            activeTab: 'offline',
            searchValue: '',
            currentBooking: '', // Delete later
            activeBooking: false, 
        };
    }

    componentDidMount() {
        this.props.getAllBookings();
    }

    changeTabKey = (event) => {
        const activeTab = event.target.id;
        this.setState({
            activeTab,
        });
    };

    searchBooking = (value) => {
        this.setState({ searchValue: value });
    };

    handleClickBooking = (bookingId) => {
        const { getBookingDetail } = this.props;
        this.setState({ activeBooking: true }); 
        getBookingDetail(bookingId);
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
        const { _id, status, type, campus, userId, topic, subject, content, bookingDate, attachment, chat} = bookingDetail;
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
                        TODO
                    </Descriptions.Item>
                </Descriptions>
            </div>
        );
    };

    renderOfflineBookingDetail = (bookingDetail) => {
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
            attachment,
            chat,
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
                        TODO
                    </Descriptions.Item>
                </Descriptions>
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
        const { activeBooking } =this.state;
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
});

const mapDispatchToProps = (dispatch) => ({
    getAllBookings: () => dispatch(fetchAllBookingThunkAction()),
    getBookingDetail: (bookingId) =>
        dispatch(fetchBookingDetailThunkAction(bookingId)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Admin);
