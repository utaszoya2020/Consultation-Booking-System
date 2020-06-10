import React from 'react';

import './SessionPicker.scss';

const Item = ({handleTimeChange, time, value, name}) => {
    let activeClass = '';
    console.log(time);
    console.log(value);
    const timeSet = new Set(time);
    if(timeSet.has(value)) {
        activeClass = 'c-sessionpicker__btn--active';
    } else {
        activeClass = '';
    }
    return (
        <button
                className={`c-sessionpicker__btn ${activeClass}`}
                type='button'
                onClick={handleTimeChange}
                value={value}
                name={name}
            >
                {`${value}:00 - ${value}:50`}
        </button>
    );
};

const SessionPicker = props => {
    const { handleTimeChange, time } = props;

    return (
        <div className='c-sessionpicker'>
            <Item
                handleTimeChange={handleTimeChange}
                value='09'
                name='s1'
                time={time}
            />
            <Item
                handleTimeChange={handleTimeChange}
                value='10'
                name='s2'
                time={time}
            />
            <Item
                handleTimeChange={handleTimeChange}
                value='11'
                name='s3'
                time={time}
            />
            <Item
                handleTimeChange={handleTimeChange}
                value='12'
                name='s4'
                time={time}
            />
            <Item
                handleTimeChange={handleTimeChange}
                value='13'
                name='s5'
                time={time}
            />
            <Item
                handleTimeChange={handleTimeChange}
                value='14'
                name='s6'
                time={time}
            />
            <Item
                handleTimeChange={handleTimeChange}
                value='15'
                name='s7'
                time={time}
            />
            <Item
                handleTimeChange={handleTimeChange}
                value='16'
                name='s8'
                time={time}
            />
        </div>
    );
}

export default SessionPicker;