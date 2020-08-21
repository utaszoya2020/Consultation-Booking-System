import React from 'react';
import '../styles/bookingCard.scss';

function BookingCard(props) {
    const {
        start,
        end,
        title
        
    } = props;
    
    return (
        <a >
            <div className={`booking-card `}>
                <p className='booking-card__text'>
                    <strong>{`${start}${end}`}</strong> 
                </p>
                <p className='booking-card__text'>{title}</p>
                
            </div>
        </a>
    );
}

export default BookingCard;