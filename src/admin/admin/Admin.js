import React from 'react';
import { connect } from 'react-redux';
import { Row, Col, Input } from 'antd';
import { BookingCard } from '../../student/myBooking/components/BookingCard';
import { fetchAllBookingThunkAction } from '../../redux/actions/bookingAction';
import './admin.scss';

const { Search } = Input;

class Admin extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            activeTab: 'offline',
        };
    }

    componentDidMount() {
        this.props.getAllBookings();
    }

    changeTabKey = (event) => {
        const activeTab = event.target.id;
        this.setState({
            activeTab,
        });
    };

    renderBookingCard = () => {

    }

    render() {
        const { bookings } = this.props;
        console.log(bookings);
        const { activeTab } = this.state;
        const offlineTabClass =
            activeTab === 'offline'
                ? 'c-tabbar__link c-tabbar__link--active'
                : 'c-tabbar__link';
        const onlineTabClass =
            activeTab === 'online'
                ? 'c-tabbar__link c-tabbar__link--active'
                : 'c-tabbar__link';
        return (
            <div className='l-admin-container'>
                <div className='c-tabbar'>
                    <ul className='c-tabbar__menu'>
                        <li className='c-tabbar__item'>
                            <a
                                className={onlineTabClass}
                                id='online'
                                onClick={this.changeTabKey}
                            >
                                Online Booking
                            </a>
                        </li>
                        <li className='c-tabbar__item'>
                            <a
                                className={offlineTabClass}
                                id='offline'
                                onClick={this.changeTabKey}
                            >
                                Face To Face Booking
                            </a>
                        </li>
                    </ul>
                </div>
                <div className='l-admin-content'>
                    <Row>
                        <Col span={8}>
                            <div className='c-sidemenu'>
                                <div className='c-sidemenu__search'>
                                    <Search
                                        placeholder='Search'
                                        onSearch={(value) => console.log(value)}
                                    />
                                </div>
                                <div className='c-sidemenu__content'>
                                    {this.renderBookingCard}
                                </div>
                            </div>
                        </Col>
                        <Col span={16}>Menu</Col>
                    </Row>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    bookings: state.booking.bookings,
});

const mapDispatchToProps = (dispatch) => ({
    getAllBookings: () => dispatch(fetchAllBookingThunkAction())
});

export default connect(mapStateToProps, mapDispatchToProps)(Admin);