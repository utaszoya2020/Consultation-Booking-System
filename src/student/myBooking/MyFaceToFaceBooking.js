import React, { useState } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import { Input, Row, Col, Descriptions } from 'antd';
import BookingCard from './components/BookingCard';
import { fetchBookingDetailThunkAction } from '../../redux/actions/bookingAction';
import './styles/myFaceToFaceBooking.scss';

function MyFaceToFaceBooking(props) {
    const { bookings, getBookingDetail, bookingDetail } = props;
    const [activeCard, setActiveCard] = useState(false);

    const { Search } = Input;
    const myOnlineBookings = bookings.filter((booking) => {
        return booking.type === 'Offline';
    });

    const handleClickBooking = (bookingId) => {
        getBookingDetail(bookingId);
        setActiveCard(true);
    };

    const renderBookingDetail = (bookingDetail) => {
        const {
            _id,
            status,
            type,
            campus,
            userId,
            topic,
            subject,
            content,
            bookingDate,
            attachment,
            chat,
        } = bookingDetail;
        const date = moment(bookingDate).format('MMMM Do YYYY, h:mm:ss');
        return (
            <div>
                <Descriptions
                    title={`Booking Detail - ${_id}`}
                    bordered
                    column={{ xxl: 3, xl: 3, lg: 3, md: 3, sm: 2, xs: 1 }}
                >
                    <Descriptions.Item label='Name'>
                        {userId ? `${userId.firstName} ${userId.lastName}` : ''}
                    </Descriptions.Item>
                    <Descriptions.Item label='Campus'>
                        {campus}
                    </Descriptions.Item>
                    <Descriptions.Item label='Booking Date'>
                        {date}
                    </Descriptions.Item>
                    <Descriptions.Item label='Topic'>{topic}</Descriptions.Item>
                    <Descriptions.Item label='Subject'>
                        {subject}
                    </Descriptions.Item>
                    <Descriptions.Item label='Status'>
                        {status}
                    </Descriptions.Item>
                    <Descriptions.Item label='Content' span={3}>
                        {content}
                    </Descriptions.Item>
                    <Descriptions.Item label='Attachment'>
                        TODO
                    </Descriptions.Item>
                </Descriptions>
            </div>
        );
    };

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
                    {myOnlineBookings.length
                        ? myOnlineBookings.map((booking) => {
                              return (
                                  <BookingCard
                                      key={booking._id}
                                      bookingId={booking._id}
                                      firstName={booking.userId.firstName}
                                      lastName={booking.userId.lastName}
                                      subject={booking.subject}
                                      status={booking.status}
                                      handleClickBooking={handleClickBooking}
                                  />
                              );
                          })
                        : null}
                </div>
            </section>
            <section className='mybooking__right'>
                <div className='tab-content'>
                    {bookingDetail && activeCard
                        ? renderBookingDetail(bookingDetail)
                        : null}
                </div>
            </section>
        </main>
    );
}

const mapStateToProps = (state) => ({
    bookings: state.booking.bookings,
    bookingDetail: state.booking.bookingDetail,
});

const mapDispatchToProps = (dispatch) => ({
    getBookingDetail: (bookingId) =>
        dispatch(fetchBookingDetailThunkAction(bookingId)),
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(MyFaceToFaceBooking);

