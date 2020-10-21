import React, { Component } from 'react';
import { connect } from 'react-redux';
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
import { Link } from "react-router-dom";
import { ADMIN_BOOKING_URL } from '../../routes/URLMap';
import {
    fetchAllBookingThunkAction,
    fetchBookingDetailThunkAction,
    updateStatusThunkAction,
} from '../../redux/actions/bookingAction';
import { fetchUserDetailThunkAction } from '../../redux/actions/userAction';


const { Option } = Select;
const CheckboxGroup = Checkbox.Group;
// const plainOptions = [
//     {label: '09:00 - 09:50', value: '09:00 - 09:50', disabled: false},
//     {label: '10:00 - 10:50', value: '10:00 - 10:50', disabled: false},
//     {label: '11:00 - 11:50', value: '11:00 - 11:50', disabled: false},
//     {label: '12:00 - 12:50', value: '12:00 - 12:50', disabled: false},
//     {label: '13:00 - 13:50', value: '13:00 - 13:50', disabled: false},
//     {label: '14:00 - 14:50', value: '14:00 - 14:50', disabled: false},
//     {label: '15:00 - 15:50', value: '15:00 - 15:50', disabled: false},
//     {label: '16:00 - 16:50', value: '16:00 - 16:50', disabled: false},
//     ];
const plainOptions = ['09:00 - 09:50','10:00 - 10:50','11:00 - 11:50','12:00 - 12:50','13:00 - 13:50','14:00 - 14:50','15:00 - 15:50','16:00 - 16:50']
const defaultCheckedList = [];



class Scheduling extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isAbleEdit: false,
            selectedDate: moment(),
            dateRenderData: [],
            acceptedNumber: 0,
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
            allbookings: [],
            error: null
        };
    }

    componentDidMount() {
        this.getAllSessions();
        this.getAllBooking();
    }
  
    getAllBooking = () => {
        fetchAllOfflineBookings().then(data => {
           
            if(data) {
                //console.log(data);
                const allbookings = this.transDataList(data);
                this.setState({ allbookings });
                const currentDate = this.state.selectedDate.format('YYYY-MM-DD');
                console.log(allbookings[0].formatDate);
                console.log(currentDate);
                const temdata = allbookings.filter(item => item.formatDate === currentDate);
               //console.log(temdata);
               // const temp = temdata.reverse();
                //console.log(temp);
                const acceptedData = temdata.filter(item => item.status === 'accepted');
                console.log(acceptedData.length);
                this.setState({acceptedNumber: acceptedData.length});
                const sortedBooking = temdata.sort(compare('formatTime'));
                //const bookings = this.transDataList(temdata);
                const bookings = temdata;
               // console.log(sortedBooking);
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
        console.log(data);
        const dataList = [];
        data.forEach(item => {
            const { bookingDate, bookingTime, userId, bookingNum, campus, _id, status } = item;
            const { firstName, lastName, studentId } = userId;
            const formatDate = moment(bookingDate).format('YYYY-MM-DD');
            console.log(formatDate);
            const formatTime = `${bookingTime}:00:00`;
            const formatEndTime = `${bookingTime}:50:00`;
            const startString = `${formatDate} ${formatTime}`;
            const endString = `${formatDate} ${formatEndTime}`;
            const start = new Date(startString);
            const end = new Date(endString);
            const object = {
                title: `${firstName} ${lastName} (${studentId}) ${bookingNum}`,
                formatDate,
                formatTime,
                start,
                end,
                campus,
                _id,
                status
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
           
            this.setState({currentSessionTime:temperatesession});
       
          }, 0);
        
        
        this.setState({
          checkedList,
          indeterminate: !!checkedList.length && checkedList.length < plainOptions.length,
          checkAll: checkedList.length === plainOptions.length,
          
        });
      };

      onCheckAllChange = e => {
        setTimeout(() => {
            const temperatesession = transformArray(this.state.checkedList);
       
            this.setState({currentSessionTime:temperatesession});
       
          }, 0);
        this.setState({
          checkedList: e.target.checked ? plainOptions : [],
          indeterminate: false,
          checkAll: e.target.checked,
          
        });
      };

    getAllSessions = () => {
        fetchAllSessions().then(data => {
            console.log(data);
            //const currentDate = moment().format('YYYY-MM-DD');
            const currentDate = this.state.selectedDate.format('YYYY-MM-DD');
            const existSession = data.filter(item => item.date === currentDate)[0];
            const dateRenderData = this.getDateRenderData(data);
            
            this.setState({ dateRenderData, existSession });
            this.setState({campus:existSession.campus});
            const campusIndicator = this.checkHasCampus(existSession.campus);
            this.setState({hasCampus : campusIndicator});
            console.log(currentDate);
            console.log(existSession.campus);
            fetchSession(currentDate, existSession.campus).then(data => {
                console.log(data);
                if(data) {
                    const { time } = data;
                    this.setState({ currentSessionTime: time });
                        }
                        const sortedCurrentSession = bubbleSort(this.state.currentSessionTime);
                        const showedCurrentSession = currentSessionCreator(sortedCurrentSession);
                        console.log(showedCurrentSession);
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
  //      const { bookings } = this.state;
        const { allbookings } = this.state;
        let listData =[];
   
      //  console.log(allbookings);
        // bookings.map(item => {
        //     if (item.status === 'pending' && value.format('YYYY-MM-DD') === item.formatDate) {
        //         listData = [{
        //             type: 'warning', content: 'pending'
        //         }];
        //     }

        // });
        allbookings.map(item => {
            
            if (item.status === 'pending' && value.format('YYYY-MM-DD') === item.formatDate) {
              //  console.log(value.format('YYYY-MM-DD'));
                listData = [{
                    type: 'error', content: 'Pending'
                }];
            }
            if (item.status === 'accepted' && value.format('YYYY-MM-DD') === item.formatDate) {
                  console.log(value.format('YYYY-MM-DD'));
                
                  const loglistData = [{
                      type: 'warning', content: 'Appointment'
                  }];
                  console.log(loglistData);
                  listData=listData.concat(loglistData);
              }

        });
        dateRenderData.map(item => {
           
            if (value.format('YYYY-MM-DD')===item.date) {
                const obj ={
                    type: 'success', content: capitalize(item.campus)
                };
                listData.push(obj);
            }
            
        });
       
        
        return listData;
    }

    dateCellRender = value => {
        const listData = this.getListData(value);
       // console.log(listData);

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

    hadleClickCard = value => {
        
        const { getBookingDetail } = this.props;
        getBookingDetail(value);
        this.props.history.push(`${ADMIN_BOOKING_URL}/${value}`)
    }
  

    handleDateChange = value => {
        this.getAllBooking();
        this.setState({selectedDate:value});
        const { dateRenderData } = this.state;
        const newCampus = this.state.campus;
        let listData =[];
        
        
        const currentDate = new Date();
        const currentformatDate = moment(currentDate).format('YYYY-MM-DD');
        if(currentformatDate>value.format('YYYY-MM-DD')){
            this.setState({isAbleEdit:false});
        }else{
            this.setState({isAbleEdit:true});
        }
        
        dateRenderData.map(item => {
           
               fetchAllSessions().then(data => {
            
                        const currentDate = value.format('YYYY-MM-DD');
                        
                        const existSession = data.filter(item => item.date === currentDate)[0];
                      
                        if(existSession===undefined){
                            if(this.state.bookings.length > 0){
                                this.setState({hasCampus : true, campus: this.state.bookings[0].campus, currentSessionTime:[],checkedList:[]});
                            }
                            this.setState({campus:'sydney'});
                            this.setState({hasCampus : false, currentSessionTime:[],checkedList:[]});

                        }else if (existSession.time.length === 0 ){
                            
                            this.setState({hasCampus : true, campus: existSession.campus, currentSessionTime:[],checkedList:[]});    
                        }
                        else {
                            this.setState({hasCampus : true, campus: existSession.campus});

                        }

        }) 

            if (value.format('YYYY-MM-DD')===item.date) {
               
                listData = [{
                    type: 'success', content: capitalize(item.campus)
                }];
               
                if (listData === null) {
                    this.setState({campus:''});
                    this.setState({hasCampus : false});
                }else {
                      
                    this.setState({campus:item.campus});
                    this.setState({hasCampus : true});
                    fetchAllSessions().then(data => {
                      
                        const currentDate = value.format('YYYY-MM-DD');
                        const existSession = data.filter(item => item.date === currentDate)[0];
                      
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
        console.log("here");
        const date = selectedDate.format('YYYY-MM-DD');
        this.setState({ isLoading: true }, () => {
            if(!hasCampus) {
                addSession(date, currentSessionTime, campus).then(() => {
                    this.setState({ isLoading: false, hasCampus: true }, () => {
                        console.log("2")
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
                if(existSession===undefined){
                    fetchAllSessions().then(data => {
                        
                                    const currentDate = this.state.selectedDate.format('YYYY-MM-DD');
                                    
                                    const existSession = data.filter(item => item.date === currentDate)[0];
                                    setTimeout(() => {
                                        this.setState({ existSession });
                                      }, 0);
                                    
                                   
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
                });
                
                return;
            }
//
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
        if(this.state.checkedList.length === 0) {
            return message.warning('Please select sessions!');
        }
        //console.log("hhihihi")
        this.handleUpdate();
    }

    render() {
        const { selectedDate, currentSessionTime, campus, selectedKeys } = this.state;

        return (
            <div className='l-scheduling'>
                <h4 className='l-scheduling__title'>Schedule Dashboard</h4>
                <div className='l-scheduling__container'>
                    <div className='l-scheduling__left'>
                        <Calendar className='l-scheduling__calendar'  dateCellRender={this.dateCellRender} value={selectedDate} onSelect={this.handleDateChange} />
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
                                    <Option value={CAMPUS.HOBART}>{capitalize(CAMPUS.HOBART)}</Option>
                                </Select>
                            </div>
                            <div className='l-scheduling__detail' >
                                <h5>Available Time: </h5>
                                <div className='l-scheduling__list'>
                                    <div className="site-checkbox-all-wrapper">
                                        {this.state.isAbleEdit
                                        ?<Checkbox
                                            indeterminate={this.state.indeterminate}
                                            onChange={this.onCheckAllChange}
                                            checked={this.state.checkAll}
                                            
                                        >
                                            Click all
                                        </Checkbox>
                                        :<Checkbox
                                        indeterminate={this.state.indeterminate}
                                        onChange={this.onCheckAllChange}
                                        checked={this.state.checkAll}
                                        disabled
                                    >
                                        Click all
                                    </Checkbox>
                                    }
                                        
                                        <br/>
                                    </div>
                                    
                                    <div className="ant-checkbox-group-item" > 
                                        {this.state.isAbleEdit
                                        ? <CheckboxGroup
                                            
                                            options={this.state.timeOptions}
                                            value={this.state.checkedList}
                                            onChange={this.onChange}
                                            
                                        />
                                        :<CheckboxGroup
                                            
                                            options={this.state.timeOptions}
                                            value={this.state.checkedList}
                                            onChange={this.onChange}
                                            disabled
                                        />
                                        }   
                                        
                                         
                                        
                                     </div>
                                </div>
                                <div className='l-scheduling__btn'>
                                    <Popconfirm
                                        title='Are you sure to update?'
                                        onConfirm={this.onConfirm}
                                        okText='Yes'
                                        cancelText='No'
                                    >
                                        {this.state.isAbleEdit
                                        ?<Button type='primary' size='large' onClick={this.test} >
                                            Update
                                        </Button>
                                        :<Button type='primary' size='large' onClick={this.test} disabled>
                                        Update
                                    </Button>
                                        }
                                        
                                    </Popconfirm>
                                </div>
                                <div>
                                    {this.state.bookings.map((booking) => {
                                        return  (
                                            <button onClick={()=>this.hadleClickCard(booking._id)}>
                                           <BookingCardAdmin 
                                            bookings = {booking}
                                            start = {booking.start}
                                            end = {booking.end}
                                            title = {booking.title}
                                            id = {booking._id}
                                            status = {booking.status}
                                       
                                           />
                                           </button>
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
const mapStateToProps = (state) => ({
    bookings: state.booking.bookings,
    bookingDetail: state.booking.bookingDetail,
    firstName: state.user.firstName,
    lastName: state.user.lastName,
});

const mapDispatchToProps = (dispatch) => ({
    getAllBookings: () => dispatch(fetchAllBookingThunkAction()),
    getBookingDetail: (bookingId) =>
        dispatch(fetchBookingDetailThunkAction(bookingId)),
    fetchUserDetail: (userId) => dispatch(fetchUserDetailThunkAction(userId)),
    updateStatus: (currentBookingId, status) =>
        dispatch(updateStatusThunkAction(currentBookingId, status)),
    
});
export default connect(mapStateToProps, mapDispatchToProps)(Scheduling);
