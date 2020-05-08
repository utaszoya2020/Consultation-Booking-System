import React from "react";

import "../styles/timePicker.scss";

const TimePicker = props => {
    const { handleTimeChange } = props;

    return (
        <div className='c-timepicker'>
            <button
                className='c-timepicker__btn'
                type='button'
                onClick={handleTimeChange}
                value='9'
                name='s1'
            >
                9:00 - 9:50
            </button>
            <button
                type='button'
                className='c-timepicker__btn isDisabled'
                disabled
                onClick={handleTimeChange}
                value='10'
                name='s2'
            >
                10:00 - 10:50
            </button>
            <button
                className='c-timepicker__btn'
                type='button'
                onClick={handleTimeChange}
                value='11'
                name='s3'
            >
                11:00 - 11:50
            </button>
            <button
                className='c-timepicker__btn'
                type='button'
                onClick={handleTimeChange}
                value='11'
                name='s4'
            >
                12:00 - 12:50
            </button>
            <button
                className='c-timepicker__btn'
                type='button'
                onClick={handleTimeChange}
                value='13'
                name='s5'
            >
                13:00 - 13:50
            </button>
            <button
                className='c-timepicker__btn'
                type='button'
                onClick={handleTimeChange}
                value='14'
                name='s6'
            >
                14:00 - 14:50
            </button>
            <button
                className='c-timepicker__btn'
                type='button'
                onClick={handleTimeChange}
                value='15'
                name='s7'
            >
                15:00 - 15:50
            </button>
            <button
                className='c-timepicker__btn'
                type='button'
                onClick={handleTimeChange}
                value='16'
                name='s8'
            >
                16:00 - 16:50
            </button>
        </div>
    );
}

export default TimePicker;