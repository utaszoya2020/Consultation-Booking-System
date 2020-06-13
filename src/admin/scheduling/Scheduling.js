import React, { Component } from 'react';
import { Calendar, Alert, Select, Button, Transfer, Popconfirm, message } from 'antd';
import moment from 'moment';
//import SessionPicker from './SessionPicker';
import { addSession, fetchSession, deleteSession, updateSession } from '../../utils/api/session';
import { SESSION_RANGE } from '../../constants/setting';
import { sessionCreator } from '../../utils/function';
import './Scheduling.scss';

const { Option } = Select;

const validRange = [moment(), moment().add(17,'days')];

class Scheduling extends Component {
    constructor(props) {
        super(props);

        this.state = {
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
            selectedKeys: [],
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

    handleCampusChange = value => {
        const {selectedDate} = this.state;
        this.setState({
            campus: value,
            currentSessionTime: [],
            existSession: [],
            selectedKeys: []
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
    getSessionData = () => {
        return sessionCreator(SESSION_RANGE);
    }

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
                    this.setState({ isLoading: false }, () => {
                        message.success('Update success!');
                    });
                })
                .catch((error) =>
                    this.setState({ error, isLoading: false }, () => {
                        message.error('Update failed!');
                    })
                );
            } else if(currentSessionTime.length === 0) {
                deleteSession(date, campus).then(() => {
                    this.setState({ isLoading: false }, () => {
                        message.success('Update success!');
                    });
                })
                .catch((error) =>
                    this.setState({ error, isLoading: false }, () => {
                        message.error('Update failed!');
                    })
                );
            } else {
                const sessionId = existSession._id;
                updateSession(sessionId, currentSessionTime).then(() => {
                    this.setState({ isLoading: false }, () => {
                        message.success('Update success!');
                    });
                })
                .catch((error) =>
                    this.setState({ error, isLoading: false }, () => {
                        message.error('Update failed!');
                    })
                );
            }
        });
    };

    onConfirm = () => {
        const { campus } = this.state;
        if(!campus) {
            return message.warning('Please select a campus!');
        }
        this.handleUpdate();
    }

    render() {
        const { selectedDate, currentSessionTime, campus, selectedKeys } = this.state;

        return (
            <div className='l-scheduling'>
                <h4 className='l-scheduling__title'>Schedule Dashboard</h4>
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
                                    {/* <SessionPicker handleTimeChange={this.handleTimeChange} time={this.state.time} /> */}
                                    <Transfer
                                        dataSource={this.getSessionData()}
                                        titles={['Session', 'Active']}
                                        targetKeys={currentSessionTime}
                                        selectedKeys={selectedKeys}
                                        onChange={this.handleChange}
                                        onSelectChange={this.handleSelectChange}
                                        render={item => item.title}
                                        oneWay
                                        listStyle={{
                                            height: 314,
                                            width: 175
                                        }}
                                        disabled={!campus}
                                    />
                                </div>
                                <div className='l-scheduling__btn'>
                                    <Popconfirm
                                        title="Are you sure to update?"
                                        onConfirm={this.onConfirm}
                                        okText="Yes"
                                        cancelText="No"
                                    >
                                        <Button type="primary" size='large' onClick={this.test}>
                                            Update
                                        </Button>
                                    </Popconfirm>
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
