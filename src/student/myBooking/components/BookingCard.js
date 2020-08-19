import React from 'react';
import '../styles/bookingCard.scss';

function BookingCard(props) {
    const {
        bookingId,
        firstName,
        lastName,
        studentId,
        topic,
        status,
        handleClickBooking,
        currentBookingId,
    } = props;
    let activeClass = '';
    if (currentBookingId && bookingId && (currentBookingId === bookingId)) {
        activeClass = 'booking-card--active';
    }

    return (
        <a onClick={() => handleClickBooking(bookingId)}>
            <div className={`booking-card ${activeClass}`}>
                <p className='booking-card__text'>
                    <strong>{`${firstName} ${lastName}(${studentId})`}</strong> 
                </p>
                <p className='booking-card__text'>{topic}</p>
                <p className='booking-card__text'>{status}</p>
            </div>
        </a>
    );
}

export default BookingCard;