import React from 'react';
import { connect } from 'react-redux';
import BookiingDetail from '../../UI/bookingDetail/BookingDetail';
import { fetchUserId } from '../../utils/authentication';
import { fetchBookingThunkAction } from '../../redux/actions/bookingAction';
import './styles/home.scss';

class Home extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            userId: ''
        };
    }

    componentDidMount() {
        this.getUserId();
    }

    getUserId = () => {
        const userId = fetchUserId();
        this.setState({ userId }, ()=> {
            this.props.fetchMyBooking(userId);
        });
    };


    render() {
        const bookings = this.props.bookings;
        const upComingBookings = bookings.filter(booking => {
            const now = new Date().getTime();
            const time = new Date(booking.bookingDate).getTime();
            const isExpired = now - time > 0;
            return !isExpired;
        });
        console.log(upComingBookings);
        const bookingNumbers = upComingBookings.length;
        return (
            <div className='homepage'>
                <div className='homepage__block'>
                    <h1 className='homepage__title'>
                        Welcome Dom, You have {bookingNumbers} up coming
                        booking!
                    </h1>
                </div>
                {upComingBookings.map((booking) => {
                    return (
                        <BookiingDetail
                            key={booking._id}
                            booking={booking}
                        />
                    );
                })}
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    bookings: state.booking.bookings,
});

const mapDispatchToProps = (dispatch) => ({
    fetchMyBooking: (userId) => dispatch(fetchBookingThunkAction(userId)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Home);
