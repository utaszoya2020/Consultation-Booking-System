import React from 'react';
import RightArrow from '../../../assets/icon/iconfinder_icon-ios7-arrow-right_211607.svg';
import '../styles/bookingCard.scss';

function BookingCard(props) {
    const {
        bookingId,
        firstName,
        lastName,
        subject,
        status,
        handleClickBooking,
    } = props;
    return (
        <a onClick={() => handleClickBooking(bookingId)} >
            <div className='booking-card'>
                <p className='booking-card__text'>
                    <strong>{`${firstName} ${lastName}`}</strong> (412456)
                </p>
                <p className='booking-card__text'>
                    <strong>Subject</strong>: {subject}
                </p>
                <p className='booking-card__text'>
                    <strong>Status</strong>: {status}
                </p>
                <img
                    className='booking-card__img'
                    src={RightArrow}
                    alt='right arrow'
                />
            </div>
        </a>
    );
}

export default BookingCard;