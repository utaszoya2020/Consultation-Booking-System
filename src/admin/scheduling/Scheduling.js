import React, { Component } from 'react';
import { Calendar, Alert, Select, Button, Transfer } from 'antd';
import moment from 'moment';
import SessionPicker from './SessionPicker';
import { addSession, fetchAllSessionByDate } from '../../utils/api/session';
import './Scheduling.scss';

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
//const oriTargetKeys = mockData.filter(item => +item.key % 3 > 1).map(item => item.key);

class Scheduling extends Component {
    constructor(props) {
        super(props);

        this.state = {
            value: moment(),
            selectedValue: moment(),
            time: [],
            targetKeys: [],
            campus: '',
            isLoading: false,
            error: null
        };
    }

    componentDidMount() {
        this.getInitialSession();
    }

    getInitialSession = () => {
        const { value } = this.state;
        fetchAllSessionByDate(value.format('YYYY-MM-DD')).then(data => {
            console.log(data);
            const target = data.map(item => item.time);
            this.setState({ targetKeys: target });
        })
        .catch((error) =>
            this.setState({ error })
        );
    }

    handleDateChange = value => {
        this.setState({
            value,
            selectedValue: value,
        }, () => {
            fetchAllSessionByDate(value.format('YYYY-MM-DD')).then(data => {
                console.log(data);
                const target = data.map(item => item.time);
                this.setState({ targetKeys: target });
            })
            .catch((error) =>
                this.setState({ error })
            );
        });
    };
    
    onPanelChange = value => {
        this.setState({ value });
    };

    handleCampusChange = value => {
        this.setState({ campus: value });
    }

    handleTimeChange = event => {
        const selectTime = event.target.value;
        const { time } = this.state;
        const checkTime = time.filter(item => item!==selectTime);
        if(checkTime.length === time.length) {
            this.setState((state) => {
                return {time: [...state.time, selectTime]};
            });
        } else {
            this.setState((state) => {
                //const test = state.time.filter(item => item!==selectTime);
                return {time: checkTime};
            });
        }
        
    }

    handleChange = (nextTargetKeys, direction, moveKeys) => {
        this.setState({ targetKeys: nextTargetKeys });
    
        console.log('targetKeys: ', nextTargetKeys);
        console.log('direction: ', direction);
        console.log('moveKeys: ', moveKeys);
    };
    
    handleSelectChange = (sourceSelectedKeys, targetSelectedKeys) => {
        this.setState({ selectedKeys: [...sourceSelectedKeys, ...targetSelectedKeys] });
    
        console.log('sourceSelectedKeys: ', sourceSelectedKeys);
        console.log('targetSelectedKeys: ', targetSelectedKeys);
    };
    
    handleScroll = (direction, e) => {
        console.log('direction:', direction);
        console.log('target:', e.target);
    };

    handleUpdate = () => {
        const { targetKeys, selectedValue, campus } = this.state;
        const sessions = targetKeys.map(item => {
            return {
                date: selectedValue.format('YYYY-MM-DD'),
                time: item,
                campus: campus
            };
        });
        console.log(sessions);
        this.setState({ isLoading: true }, () => {
            addSession(sessions).then(() => {
                this.setState({ isLoading: false });
            })
            .catch((error) =>
                this.setState({ error, isLoading: false })
            );
        });
    };

    render() {
        const { value, selectedValue, time, targetKeys, isLoading } = this.state;
        const validRange = [moment().subtract(1, 'days'), moment().add(17,'days')];
        const y = true;
        return (
            <div className='l-scheduling'>
                <h4 className='l-scheduling__title'>Please select the available time below</h4>
                <div className='l-scheduling__container'>
                    <div className='l-scheduling__left'>
                        <Calendar validRange={validRange} value={value} onSelect={this.handleDateChange} onPanelChange={this.onPanelChange} />
                    </div>
                    <div className='l-scheduling__right'>
                        <Alert
                            message={`Selected Date: ${selectedValue && selectedValue.format('MMM Do YY')}`}
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
                                    <SessionPicker handleTimeChange={this.handleTimeChange} time={time} />
                                    {/* <Transfer
                                        dataSource={mockData}
                                        titles={['Session', 'Available']}
                                        targetKeys={targetKeys}
                                        onChange={this.handleChange}
                                        onSelectChange={this.handleSelectChange}
                                        onScroll={this.handleScroll}
                                        render={item => item.title}
                                        oneWay={y}
                                        listStyle={{
                                            height: 314,
                                            width: 175
                                        }}
                                    /> */}
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
