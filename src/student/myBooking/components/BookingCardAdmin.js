import React from 'react';
import {generateStartTime, generateEndTime} from '../../../utils/function';
import '../styles/bookingCard.scss';
import { ADMIN_BOOKING_URL } from '../../../routes/URLMap';

function BookingCard(props) {
    const {
        start,
        end,
        title,
        id,
        
        
    } = props;

const startTime = generateStartTime(props.start);
const endTime = generateEndTime(props.end);
const routeChange = (props) =>{ 
    console.log(props);
    // let path = `${ADMIN_BOOKING_URL}/:id`
    // history.push(path);
  }

    
    return (
        <a>
            <div className={`booking-card `}>
                <p className='booking-card__text'>
                    <strong>{`${startTime}--${endTime}`}</strong> 
                </p>
                <p className='booking-card__text'>{title}</p>
                
            </div>
        </a>
    );
}

export default BookingCard;