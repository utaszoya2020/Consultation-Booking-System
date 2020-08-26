import React, { Component } from 'react';
import { Calendar, Badge, Alert, Select, Button, Checkbox, Popconfirm, message } from 'antd';
import moment from 'moment';
import { unionBy, capitalize } from 'lodash';
import { addSession, fetchSession, deleteSession, updateSession, fetchAllSessions } from '../../utils/api/session';
import { SESSION_RANGE, SCHEDULE_DEFAULT_CAMPUS } from '../../constants/setting';
import { CAMPUS } from '../../constants/option';
import { sessionCreator } from '../../utils/function';
import './Scheduling.scss';
import 'antd/dist/antd.css';
import {bubbleSort} from '../../utils/function';
import {currentSessionCreator, transformArray, generatenewTimeOptions, compare} from '../../utils/function';
import BookingCardAdmin from '../../student/myBooking/components/BookingCardAdmin';
import { fetchAllOfflineBookings } from '../../utils/api/booking';


const { Option } = Select;
const CheckboxGroup = Checkbox.Group;
const plainOptions = [
    {label: '09:00 - 09:50', value: '09:00 - 09:50', disabled: false},
    {label: '10:00 - 10:50', value: '10:00 - 10:50', disabled: false},
    {label: '11:00 - 11:50', value: '11:00 - 11:50', disabled: false},
    {label: '12:00 - 12:50', value: '12:00 - 12:50', disabled: false},
    {label: '13:00 - 13:50', value: '13:00 - 13:50', disabled: false},
    {label: '14:00 - 14:50', value: '14:00 - 14:50', disabled: false},
    {label: '15:00 - 15:50', value: '15:00 - 15:50', disabled: false},
    {label: '16:00 - 16:50', value: '16:00 - 16:50', disabled: false},
    ];
const defaultCheckedList = [];


class Scheduling extends Component {
    constructor(props) {
        super(props);

        this.state = {
           
            selectedDate: moment(),
            dateRenderData: [],
            selectedKeys: [],
            currentSessionTime: [],
            existSession: {},
            campus: SCHEDULE_DEFAULT_CAMPUS,
            isLoading: false,
            timeOptions: plainOptions,
            checkedList: defaultCheckedList,
            indeterminate: true,
            checkAll: false,
            hasCampus: false,
            bookings: [],
            error: null
        };
    }

    componentDidMount() {
        this.getAllSessions();
        this.getAllBooking();
    }

    getAllBooking = () => {
        fetchAllOfflineBookings().then(data => {
            console.log(data);
            if(data) {
                console.log(data[3].bookingDate.slice(0,10));
                const currentDate = this.state.selectedDate.format('YYYY-MM-DD');
                console.log(currentDate);
                const temdata = data.filter(item => item.bookingDate.slice(0,10) === currentDate);
                console.log(temdata);
                const sortedBooking = temdata.sort(compare('bookingTime'));
                const bookings = this.transDataList(temdata);
                console.log(sortedBooking);
                this.setState({ bookings });
                const newTimeOptions = generatenewTimeOptions(bookings);
                this.setState({timeOptions: newTimeOptions })
            }
        })
        .catch(error => {
            this.setState({ error });
        });
    }

    transDataList = (data) => {
        const dataList = [];
        data.forEach(item => {
            const { bookingDate, bookingTime, userId, bookingNum, campus } = item;
            const { firstName, lastName, studentId } = userId;
            const formatDate = moment(bookingDate).format('YYYY-MM-DD');
            const formatTime = `${bookingTime}:00:00`;
            const formatEndTime = `${bookingTime}:50:00`;
            const startString = `${formatDate} ${formatTime}`;
            const endString = `${formatDate} ${formatEndTime}`;
            const start = new Date(startString);
            const end = new Date(endString);
            const object = {
                title: `${firstName} ${lastName} (${studentId}) ${bookingNum}`,
                start,
                end,
                campus
            };
            dataList.push(object);
        });
        return dataList;
    }

    checkHasCampus = (campus) => {
        if(campus){
            return true;
        } else if (this.state.bookings.length > 0){
            return true;
        } else {
            return false;
        }
        
    }

    //checklist change
    onChange = checkedList => {

        setTimeout(() => {
            const temperatesession = transformArray(this.state.checkedList);
            console.log(temperatesession);
            this.setState({currentSessionTime:temperatesession});
       
          }, 0);
        
        
        this.setState({
          checkedList,
          indeterminate: !!checkedList.length && checkedList.length < plainOptions.length,
          checkAll: checkedList.length === plainOptions.length,
          
        });
      };

      onCheckAllChange = e => {
        this.setState({
          checkedList: e.target.checked ? plainOptions : [],
          indeterminate: false,
          checkAll: e.target.checked,
        });
      };

    getAllSessions = () => {
        fetchAllSessions().then(data => {
            
            const currentDate = moment().format('YYYY-MM-DD');
            const existSession = data.filter(item => item.date === currentDate)[0];
            const dateRenderData = this.getDateRenderData(data);
            this.setState({ dateRenderData, existSession });
            this.setState({campus:existSession.campus});
            const campusIndicator = this.checkHasCampus(existSession.campus);
            this.setState({hasCampus : campusIndicator});
            fetchSession(currentDate, existSession.campus).then(data => {
                console.log(data);
                if(data) {
                    const { time } = data;
                    this.setState({ currentSessionTime: time });
                        }
                        const sortedCurrentSession = bubbleSort(this.state.currentSessionTime);
                        const showedCurrentSession = currentSessionCreator(sortedCurrentSession);
                        this.setState({checkedList: showedCurrentSession});
                                                                })
                                                                })
        .catch(error => {
            this.setState({ error });
        });
            
    }

    getDateRenderData = (allSessions) => {
        let campusDate = [];
        allSessions.map(item => {
            if(item.time.length > 0) {
                let date=item.date.toString();
                let campus = item.campus;
                let object = {date, campus};
                campusDate.push(object);
            }
        });
        return unionBy(campusDate, 'date');
    }

    getListData = value => {
        const { dateRenderData } = this.state;
        let listData =[];
        dateRenderData.map(item => {
            if (value.format('YYYY-MM-DD')===item.date) {
                listData = [{
                    type: 'success', content: capitalize(item.campus)
                }];
            }
        });
        return listData;
    }

    dateCellRender = value => {
        const listData = this.getListData(value);

        return (
            <ul className='l-scheduling__events'>
                {listData.map(item => (
                    <li key={item.content} className='l-scheduling__list-item'>
                        <Badge status={item.type} text={item.content} />
                    </li>
                ))}
            </ul>
        );
    }

    disabledDate = current => {
        return current < moment().endOf('day');
    }

    handleDateChange = value => {
        this.getAllBooking();
        this.setState({selectedDate:value});
        const { dateRenderData } = this.state;
        const newCampus = this.state.campus;
        let listData =[];
        console.log(newCampus);
        
        dateRenderData.map(item => {
            console.log('2');
               fetchAllSessions().then(data => {
            console.log(data);
                        const currentDate = value.format('YYYY-MM-DD');
                        console.log(currentDate);
                        const existSession = data.filter(item => item.date === currentDate)[0];
                        console.log(existSession);
                        if(existSession===undefined){
                            if(this.state.bookings.length > 0){
                                this.setState({hasCampus : true, campus: this.state.bookings[0].campus, currentSessionTime:[],checkedList:[]});
                            }
                            this.setState({campus:'sydney'});
                            this.setState({hasCampus : false, currentSessionTime:[],checkedList:[]});

                        }else if (existSession.time.length === 0 ){
                            console.log('jjjjj');  
                            this.setState({hasCampus : true, campus: existSession.campus, currentSessionTime:[],checkedList:[]});    
                        }
                        else {
                            this.setState({hasCampus : true, campus: existSession.campus});

                        }

        }) 

            if (value.format('YYYY-MM-DD')===item.date) {
                console.log(item.date);
                listData = [{
                    type: 'success', content: capitalize(item.campus)
                }];
                console.log(listData);
                if (listData === null) {
                    this.setState({campus:''});
                    this.setState({hasCampus : false});
                }else {
                    console.log(item.campus);    
                    this.setState({campus:item.campus});
                    this.setState({hasCampus : true});
                    fetchAllSessions().then(data => {
                      
                        const currentDate = value.format('YYYY-MM-DD');
                        const existSession = data.filter(item => item.date === currentDate)[0];
                        console.log(existSession);
                        this.setState({ existSession, campus: existSession.campus });
                        //this.setState({campus:existSession.campus});
                        fetchSession(currentDate, existSession.campus).then(data => {
                            
                            if(data) {
                                const { time } = data;
                                this.setState({ currentSessionTime: time });
                                    }
                                    const sortedCurrentSession = bubbleSort(this.state.currentSessionTime);
                                    const showedCurrentSession = currentSessionCreator(sortedCurrentSession);
                                    this.setState({checkedList: showedCurrentSession});
                                                                            })
                                                                            })
                    .catch(error => {
                        this.setState({ error });
                    });
        }
            }
         })
       
    };

    handleCampusChange = value => {
        const {selectedDate} = this.state;
        this.setState({
            campus: value,
            currentSessionTime: [],
            existSession: [],
            selectedKeys: []
        }, () => {
            setTimeout(() => {
                const temperatesession = transformArray(this.state.checkedList);
                console.log(temperatesession);
                this.setState({currentSessionTime:temperatesession});
           
              }, 0);
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
        const { currentSessionTime, selectedDate, campus, hasCampus, existSession } = this.state;
        
        const date = selectedDate.format('YYYY-MM-DD');
        this.setState({ isLoading: true }, () => {
            if(!hasCampus) {
                addSession(date, currentSessionTime, campus).then(() => {
                    this.setState({ isLoading: false, hasCampus: true }, () => {
                        
                        this.getAllSessions();
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
                        this.getAllSessions();
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
                        this.getAllSessions();
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
                        <Calendar className='l-scheduling__calendar'  dateCellRender={this.dateCellRender} disabledDate={this.disabledDate} value={selectedDate} onSelect={this.handleDateChange} />
                    </div>
                    <div className='l-scheduling__right'>
                        <Alert
                            message={`Selected Date: ${selectedDate && selectedDate.format('MMM Do YY')}`}
                        />
                        <div className='l-scheduling__content' >
                            <div className='l-scheduling__location'>

                                <label className='l-scheduling__label'>Campus:{this.state.hasCampus ? capitalize(campus) : ''}</label>
                                <Select className={this.state.hasCampus ? 'l-scheduling__hidden' : ''} placeholder='Select a campus' defaultValue={capitalize(campus)} style={{ width: 200 }} onChange={this.handleCampusChange}>
                                    <Option value={CAMPUS.BRISBANE}>{capitalize(CAMPUS.BRISBANE)}</Option>
                                    <Option value={CAMPUS.SYDNEY}>{capitalize(CAMPUS.SYDNEY)}</Option>
                                    <Option value={CAMPUS.MELBOURNE}>{capitalize(CAMPUS.MELBOURNE)}</Option>
                                    <Option value={CAMPUS.HOBART}>{capitalize(CAMPUS.HOBART)}</Option>
                                </Select>
                            </div>
                            <div className='l-scheduling__detail' >
                                <h5>Available Time: </h5>
                                <div className='l-scheduling__list'>
                                    <div className="site-checkbox-all-wrapper">
                                        <Checkbox
                                            indeterminate={this.state.indeterminate}
                                            onChange={this.onCheckAllChange}
                                            checked={this.state.checkAll}
                                        >
                                            Check all
                                        </Checkbox>
                                        <br/>
                                    </div>
                                    
                                    <div className="ant-checkbox-group-item" > 
                                        <CheckboxGroup
                                            
                                            options={this.state.timeOptions}
                                            value={this.state.checkedList}
                                            onChange={this.onChange}
                                        />
                                     </div>
                                </div>
                                <div className='l-scheduling__btn'>
                                    <Popconfirm
                                        title='Are you sure to update?'
                                        onConfirm={this.onConfirm}
                                        okText='Yes'
                                        cancelText='No'
                                    >
                                        <Button type='primary' size='large' onClick={this.test}>
                                            Update
                                        </Button>
                                    </Popconfirm>
                                </div>
                                <div>
                                    {this.state.bookings.map((booking) => {
                                        return  (
                                           <BookingCardAdmin 
                                            bookings = {booking}
                                            start = {booking.start}
                                            end = {booking.end}
                                            title = {booking.title}

                                           />
                                        )
                                     })
                                    }
                                    

                                    
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
