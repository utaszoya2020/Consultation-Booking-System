import React from 'react';
import './bookingDetail.scss';
import moment from 'moment';
import { capitalize } from 'lodash';

function BookingDetail(props) {
    const {bookingNum, bookingDate, bookingTime, type, topic, status} = props.booking;
    const date = moment(bookingDate).format('DD/MM/YYYY');
    const time = `${date} ${bookingTime}:00 - ${bookingTime}:50`;
    const isOfflineBooking = type === 'offline' ? true : false;

    return (
        <div className='homepage__mybooking'>
            <h5 className='booking__title'>Ticket Number: {bookingNum}</h5>
            <p>
                <strong>Type</strong>: {isOfflineBooking ? 'Face to Face Booking' : 'Online Booking'}
            </p>
            <p>
                <strong>Date</strong>: {isOfflineBooking ? `${time}` : `${date}`}
            </p>
            <p>
                <strong>Topic</strong>: {capitalize(topic)}
            </p>
            <p>
                <strong>Status</strong>: Your request is {status}!
            </p>
        </div>
    );
}

export default BookingDetail;