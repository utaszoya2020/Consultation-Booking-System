import React from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import { fetchAllOfflineBookings } from '../../utils/api/booking';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const localizer = momentLocalizer(moment);

class Calender extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            bookings: [],
            error: null
        };
    }

    componentDidMount() {
        this.getAllBooking();
    }

    getAllBooking = () => {
        fetchAllOfflineBookings().then(data => {
            if(data) {
                const bookings = this.transDataList(data);
                this.setState({ bookings });
            }
        })
        .catch(error => {
            this.setState({ error });
        });
    }

    transDataList = (data) => {
        const dataList = [];
        data.forEach(item => {
            const { bookingDate, bookingTime, campus, userId, bookingNum, topic } = item;
            const object = {
                title: `${userId.firstName} ${userId.lastName}`,
                start: bookingDate,
                end: bookingDate,
            };
            dataList.push(object);
        });
        return dataList;
    }

    render() {
        return (
            <div style={{paddingTop: '26px'}}>
                <Calendar
                    localizer={localizer}
                    events={this.state.bookings}
                    startAccessor="start"
                    endAccessor="end"
                    style={{ height: 550 }}
                />
            </div>
        );
    }
}

export default Calender;