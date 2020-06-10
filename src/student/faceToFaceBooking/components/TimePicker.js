import React from 'react';

import '../styles/timePicker.scss';

const Item = ({handleTimeChange, time, value}) => {
    let activeClass = '';
    if(time === value) {
        activeClass = 'c-timepicker__btn--active';
    }
    return (
        <button
                className={`c-timepicker__btn ${activeClass}`}
                type='button'
                onClick={handleTimeChange}
                value={value}
            >
                {`${value}:00 - ${value}:50`}
        </button>
    );
};

const TimePicker = props => {
    const { handleTimeChange, time } = props;
    const sessionList = [];
    for (let i = 9; i < 17; i++) {
        let key = '';
        if(i===9) {
            key = '09';
        } else {
            key = i.toString();
        }
        sessionList.push(key);
    }

    return (
        <div className='c-timepicker'>
            {
                sessionList.map(session => {
                    return (
                        <Item
                            handleTimeChange={handleTimeChange}
                            value={session}
                            time={time}
                            key={session}
                        />
                    );
                })
            }
        </div>
    );
}

export default TimePicker;