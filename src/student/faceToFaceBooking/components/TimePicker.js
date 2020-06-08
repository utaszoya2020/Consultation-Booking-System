import React from 'react';

import '../styles/timePicker.scss';

const Item = ({handleTimeChange, active, value, name}) => {
    let activeClass = '';
    if(active === value) {
        activeClass = 'c-timepicker__btn--active';
    }
    return (
        <button
                className={`c-timepicker__btn ${activeClass}`}
                type='button'
                onClick={handleTimeChange}
                value={value}
                name={name}
            >
                {`${value}:00 - ${value}:50`}
        </button>
    );
};

const TimePicker = props => {
    const { handleTimeChange, time } = props;

    return (
        <div className='c-timepicker'>
            <Item
                handleTimeChange={handleTimeChange}
                value='9'
                name='s1'
                active={time}
            />
            <Item
                handleTimeChange={handleTimeChange}
                value='10'
                name='s2'
                active={time}
            />
            <Item
                handleTimeChange={handleTimeChange}
                value='11'
                name='s3'
                active={time}
            />
            <Item
                handleTimeChange={handleTimeChange}
                value='12'
                name='s4'
                active={time}
            />
            <Item
                handleTimeChange={handleTimeChange}
                value='13'
                name='s5'
                active={time}
            />
            <Item
                handleTimeChange={handleTimeChange}
                value='14'
                name='s6'
                active={time}
            />
            <Item
                handleTimeChange={handleTimeChange}
                value='15'
                name='s7'
                active={time}
            />
            <Item
                handleTimeChange={handleTimeChange}
                value='16'
                name='s8'
                active={time}
            />
        </div>
    );
}

export default TimePicker;