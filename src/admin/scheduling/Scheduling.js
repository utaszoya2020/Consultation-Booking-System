import React, { Component } from 'react';
import { Calendar, Alert, Select, Button, Transfer } from 'antd';
import moment from 'moment';
import SessionPicker from './SessionPicker';
import { addSession, fetchSession, deleteSession, updateSession } from '../../utils/api/session';
import './Scheduling.scss';
import { updateBookingStatus } from '../../utils/api/booking';

const { Option } = Select;

const mockData = [];
for (let i = 9; i < 17; i++) {
    if(i===9) {
        const key = '09';
        mockData.push({
            key,
            title: `${key}:00 - ${key}:50`,
        });
    } else {
        const key = i.toString();
        mockData.push({
            key,
            title: `${key}:00 - ${key}:50`,
        });
    }
}
//const oricurrentSessionTime = mockData.filter(item => +item.key % 3 > 1).map(item => item.key);

class Scheduling extends Component {
    constructor(props) {
        super(props);

        this.state = {
            //value: moment(),
            selectedDate: moment(),
            //time: [],
            selectedKeys: [],
            currentSessionTime: [],
            existSession: {},
            campus: '',
            isLoading: false,
            error: null
        };
    }


    handleDateChange = value => {
        const { campus } = this.state;
        this.setState({
            currentSessionTime: [],
            existSession: [],
            selectedDate: value,
        }, () => {
            if(campus) {
                const date = value.format('YYYY-MM-DD');
            fetchSession(date, campus).then(data => {
                if(data) {
                    const { time } = data;
                    this.setState({ currentSessionTime: time, existSession: data });
                }
            })
            .catch((error) =>
                this.setState({ error })
            );
            }
        });
    };
    
/*     onPanelChange = value => {
        this.setState({ value });
    }; */

    handleCampusChange = value => {
        const {selectedDate} = this.state;
        this.setState({
            campus: value,
            currentSessionTime: [],
            existSession: [],
        }, () => {
            const date = selectedDate.format('YYYY-MM-DD');
            fetchSession(date, value).then(data => {
                if(data) {
                    const { time } = data;
                    this.setState({ currentSessionTime: time, existSession: data });
                }
            })
            .catch((error) =>
                this.setState({ error })
            );
        });
    }

/*     handleTimeChange = event => {
        const selectTime = event.target.value;
        this.setState((state) => {
            const index = state.time.indexOf(selectTime);
            //const checkTime = state.time.filter(item => item===selectTime);
            if(index === -1) {
                    return {time: [...state.time, selectTime]};
            }
            const newTime = state.time.filter(item => item!==selectTime);
            return {time: newTime};
        });
        
    } */

    handleChange = (nextTargetKeys) => {
        this.setState({ currentSessionTime: nextTargetKeys });
    };
    
    handleSelectChange = (sourceSelectedKeys, targetSelectedKeys) => {
        this.setState({ selectedKeys: [...sourceSelectedKeys, ...targetSelectedKeys] });
    };

    handleUpdate = () => {
        const { currentSessionTime, selectedDate, campus, existSession } = this.state;
        
        const date = selectedDate.format('YYYY-MM-DD');
        this.setState({ isLoading: true }, () => {
            if(!existSession.time) {
                addSession(date, currentSessionTime, campus).then(() => {
                    this.setState({ isLoading: false });
                })
                .catch((error) =>
                    this.setState({ error, isLoading: false })
                );
            } else if(currentSessionTime.length === 0) {
                deleteSession(date, campus).then(() => {
                    this.setState({ isLoading: false });
                })
                .catch((error) =>
                    this.setState({ error, isLoading: false })
                );
            } else {
                const sessionId = existSession._id;
                updateSession(sessionId, currentSessionTime).then(() => {
                    this.setState({ isLoading: false });
                })
                .catch((error) =>
                    this.setState({ error, isLoading: false })
                );
            }
            /* addSession(sessions).then(() => {
                this.setState({ isLoading: false });
            })
            .catch((error) =>
                this.setState({ error, isLoading: false })
            ); */
        });
    };

    render() {
        const { selectedDate, time, currentSessionTime, isLoading, campus, selectedKeys } = this.state;
        const validRange = [moment().subtract(1, 'days'), moment().add(17,'days')];
        const y = true;
        return (
            <div className='l-scheduling'>
                <h4 className='l-scheduling__title'>Please select the available time below</h4>
                <div className='l-scheduling__container'>
                    <div className='l-scheduling__left'>
                        <Calendar validRange={validRange} value={selectedDate} onSelect={this.handleDateChange} />
                    </div>
                    <div className='l-scheduling__right'>
                        <Alert
                            message={`Selected Date: ${selectedDate && selectedDate.format('MMM Do YY')}`}
                        />
                        <div className='l-scheduling__content' >
                            <div className='l-scheduling__location'>
                                <label className='l-scheduling__label'>Campus:</label>
                                <Select placeholder="Select a campus" style={{ width: 200, }} onChange={this.handleCampusChange}>
                                    <Option value="brisbane">Brisbane</Option>
                                    <Option value="sydney">Sydney</Option>
                                    <Option value="melbourne">Melbourne</Option>
                                    <Option value="hobart">Hobart</Option>
                                </Select>
                            </div>
                            <div className='l-scheduling__detail' >
                                <h5>Available Time: </h5>
                                <div className='l-scheduling__list'>
                                    {/* <SessionPicker handleTimeChange={this.handleTimeChange} time={time} /> */}
                                    <Transfer
                                        dataSource={mockData}
                                        titles={['Session', 'Available']}
                                        targetKeys={currentSessionTime}
                                        selectedKeys={selectedKeys}
                                        onChange={this.handleChange}
                                        onSelectChange={this.handleSelectChange}
                                        render={item => item.title}
                                        oneWay={y}
                                        listStyle={{
                                            height: 314,
                                            width: 175
                                        }}
                                        disabled={!campus}
                                    />
                                </div>
                                <div className='l-scheduling__btn'>
                                    <Button type="primary" loading={isLoading} size='large' onClick={this.handleUpdate}>
                                        Update
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Scheduling;
