import React from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import { fetchAllOfflineBookings } from '../../utils/api/booking';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import './calender.scss';

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
        console.log("hello");
    }

    getAllBooking = () => {
        fetchAllOfflineBookings().then(data => {
            if(data) {
                console.log(data);
                const bookings = this.transDataList(data);
                console.log(bookings);
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
            const { bookingDate, bookingTime, userId, bookingNum } = item;
            const { firstName, lastName, studentId } = userId;
            const formatDate = moment(bookingDate).format('YYYY-MM-DD');
            const formatTime = `${bookingTime}:00:00`;
            const formatEndTime = `${bookingTime}:50:00`;
            const startString = `${formatDate} ${formatTime}`;
            const endString = `${formatDate} ${formatEndTime}`;
            const start = new Date(startString);
            const end = new Date(endString);
            const object = {
                title: `${firstName} ${lastName} (${studentId}) ${bookingNum}`,
                start,
                end,
            };
            dataList.push(object);
        });
        return dataList;
    }

    render() {
        return (
            <div style={{ paddingTop: 18, }}>
                <Calendar
                    localizer={localizer}
                    events={this.state.bookings}
                    startAccessor="start"
                    endAccessor="end"
                    style={{ height: 650, }}
                />
            </div>
        );
    }
}

export default Calender;