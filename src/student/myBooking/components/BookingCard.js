import React from 'react';
import '../styles/bookingCard.scss';

function BookingCard(props) {
    const {
        bookingId,
        firstName,
        lastName,
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
                    <strong>{`${firstName} ${lastName}`}</strong> (412456)
                </p>
                <p className='booking-card__text'>{topic}</p>
                <p className='booking-card__text'>{status}</p>
            </div>
        </a>
    );
}

export default BookingCard;