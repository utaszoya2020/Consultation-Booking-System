import React from 'react';
import { connect } from 'react-redux';
import BookiingDetail from '../../UI/bookingDetail/BookingDetail';
import { fetchUserId } from '../../utils/authentication';
import { fetchBookingThunkAction } from '../../redux/actions/bookingAction';
import { fetchUserDetailThunkAction } from '../../redux/actions/userAction';
import './styles/home.scss';

class Home extends React.Component {
    constructor(props) {
        super(props);

        this.state = {};
    }

    componentDidMount() {
        this.getUser();
    }

    getUser = () => {
        const userId = fetchUserId();
        this.setState({ userId }, () => {
            const { fetchMyBooking, fetchUserDetail } = this.props;
            fetchMyBooking(userId);
            fetchUserDetail(userId);
        });
    };

    render() {
        const { bookings, firstName, lastName } = this.props;
        const upComingBookings = bookings.filter((booking) => {
            const now = new Date().getTime();
            const time = new Date(booking.bookingDate).getTime();
            const isExpired = now - time > 0;
            return !isExpired;
        });
        const bookingNumbers = upComingBookings.length;
        return (
            <div className='homepage'>
                <div className='homepage__block'>
                    <h1 className='homepage__title'>
                        {`Welcome ${firstName}, You have ${bookingNumbers} up coming
                        booking!`}
                    </h1>
                </div>
                {upComingBookings.map((booking) => {
                    return (
                        <BookiingDetail key={booking._id} booking={booking} />
                    );
                })}
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    bookings: state.booking.bookings,
    firstName: state.user.firstName,
    lastName: state.user.lastName,
});

const mapDispatchToProps = (dispatch) => ({
    fetchMyBooking: (userId) => dispatch(fetchBookingThunkAction(userId)),
    fetchUserDetail: (userId) => dispatch(fetchUserDetailThunkAction(userId)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Home);
