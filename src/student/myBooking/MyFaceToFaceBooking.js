import React from "react";
import BookiingDetail from "../../UI/bookingDetail/BookingDetail";
import { ListGroup, Tab, Row, Col } from "react-bootstrap";
import { Input } from "antd";
import BookingCard from "./components/BookingCard";
import "./styles/myFaceToFaceBooking.scss";

function MyFaceToFaceBooking(props) {
  const handleKeyPress = event => {
    if (event.key === "Enter") {
      props.handleSearch();
    }
  };

    const { Search } = Input;

  return (
    <main className="mybooking">
      <section className="mybooking__left">
        <h2 className="mybooking__title">Booking List</h2>
        <Search
          placeholder="input search text"
          onSearch={value => console.log(value)}
          enterButton="Search"
          size="large"
        />
        <div className="list-group">
          <BookingCard />
          <BookingCard />
          <BookingCard />
          <BookingCard />
        </div>
      </section>
      <section className="mybooking__right">
        <div className="tab-content">
          <BookiingDetail />
        </div>
      </section>
    </main>
  );
}

export default MyFaceToFaceBooking;
