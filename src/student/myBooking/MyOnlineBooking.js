import React from 'react';
import BookiingDetail from '../../UI/bookingDetail/BookingDetail';
import { connect } from 'react-redux';
import { ListGroup, Tab, Row, Col } from 'react-bootstrap';
import { Input, Menu } from 'antd';
import BookingCard from './components/BookingCard';

function MyOnlineBooking(props) {
    const { bookings } = props;

    const handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            props.handleSearch();
        }
    };
    const { SubMenu } = Menu;
    const { Search } = Input;
    const myOnlineBookings = bookings.filter(booking => {
        return booking.type === 'online';
    })

    return (
        <main className='mybooking'>
            <section className='mybooking__left'>
                <h2 className='mybooking__title'>Booking List</h2>
                <Search
                    placeholder='input search text'
                    onSearch={(value) => console.log(value)}
                    enterButton='Search'
                    size='large'
                />
                <div className='list-group'>
                    <Menu
                        style={{ width: 256 }}
                        defaultSelectedKeys={['1']}
                        defaultOpenKeys={['sub1']}
                        mode={this.state.mode}
                        theme={this.state.theme}
                    >
                    { 
                    myOnlineBookings.map((booking) => {
                        return (
                            <Menu.Item key={booking._id}>
                                <BookingCard name={booking.name} />
                            </Menu.Item>
                        );
                    })
                    }
                    </Menu>
                </div>
            </section>
            <section className='mybooking__right'>
                <div className='tab-content'>
                    <BookiingDetail />
                </div>
            </section>
        </main>
    );
}

const mapStateToProps = (state) => ({
    bookings: state.booking.bookings,
});

const mapDispatchToProps = (dispatch) => ({});

export default connect(mapStateToProps, mapDispatchToProps)(MyOnlineBooking);
