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
        <div className='c-sessionpicker'>
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

export default SessionPicker;