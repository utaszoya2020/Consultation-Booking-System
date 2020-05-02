import React from 'react';
import { connect } from 'react-redux';
import { Row, Col, Input } from 'antd';
import  BookingCard from '../../student/myBooking/components/BookingCard';
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
            activeBooking: false, // Delete later
        };
    };

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
        this.setState({ currentBooking: bookingId }); // Delete later
        const value = getBookingDetail(bookingId);
        console.log(value);

    };

    renderOnlineBookingCard = (onlineBooking) => {
        const { searchValue } = this.state;
        if (onlineBooking.length) {
            // Search Filter
            if (searchValue) {
                const result = onlineBooking.filter((booking) => {
                    return (
                        booking.userId.firstName === searchValue ||
                        booking.userId.lastName === searchValue ||
                        booking.topic === searchValue ||
                        booking.subject === searchValue ||
                        booking.content.includes(searchValue)
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
        if (offlineBooking.length) {
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
    };

    renderOnlineBookingDetail = () => {
        return <p>Online Details</p>;
    };

    renderOfflineBookingDetail = () => {
        return <p>Offline Details</p>;
    };

    renderBookingCard = (onlineBooking, offlineBooking) => {
        return this.state.activeTab === 'online'
            ? this.renderOnlineBookingCard(onlineBooking)
            : this.renderOfflineBookingCard(offlineBooking);
    };

    renderBookingDetail = () => {
        return this.state.activeTab === 'online'
            ? this.renderOnlineBookingDetail()
            : this.renderOfflineBookingDetail();
    };

    render() {
        const { bookings } = this.props;
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
        console.log(onlineBooking);
        console.log(offlineBooking);
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
                                {this.renderBookingDetail(
                                    onlineBooking,
                                    offlineBooking
                                )}
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
    getBookingDetail: bookingId =>
        dispatch(fetchBookingDetailThunkAction(bookingId)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Admin);