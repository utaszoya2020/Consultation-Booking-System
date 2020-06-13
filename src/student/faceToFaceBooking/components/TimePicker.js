import React from 'react';
import { SESSION_RANGE } from '../../../constants/setting';
import { sessionValuesCreator } from '../../../utils/function';

import '../styles/timePicker.scss';

const Item = ({handleTimeChange, time, value, session}) => {
    let activeClass = '';
    if(time === value) {
        activeClass = 'c-timepicker__btn--active';
    }
    let flag = true;
    if(session) {
        flag = session.indexOf(value) === -1 ? true : false;
    }

    return (
        <button
                className={`c-timepicker__btn ${activeClass}`}
                type='button'
                onClick={handleTimeChange}
                value={value}
                disabled={flag}
            >
                {`${value}:00 - ${value}:50`}
        </button>
    );
};

const TimePicker = props => {
    const { session, handleTimeChange, time } = props;
    const valueList = sessionValuesCreator(SESSION_RANGE);

    return (
        <div className='c-timepicker'>
            {
                valueList.map(value => {
                    return (
                        <Item
                            handleTimeChange={handleTimeChange}
                            value={value}
                            time={time}
                            session={session}
                            key={value}
                        />
                    );
                })
            }
        </div>
    );
}

export default TimePicker;