import React from 'react';
import './bookingDetail.scss';
import moment from 'moment';

function BookingDetail(props) {
    const {bookingNum, bookingDate, campus, topic, status} = props.booking;
    const time = moment(bookingDate).format('DD/MM/YY  HH:mm');

    return (
        <div className='homepage__mybooking'>
            <h5 className='booking__title'>Ticket Number: {bookingNum}</h5>
            <p>
                <strong>Date</strong>: {time}
            </p>
            <p>
                <strong>Campus</strong>: {campus}
            </p>
            <p>
                <strong>Topic</strong>: {topic}
            </p>
            <p>
                <strong>Status</strong>: Your request is {status}!
            </p>
        </div>
    );
}

export default BookingDetail;