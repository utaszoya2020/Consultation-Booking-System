import React from "react";
import BookiingDetail from "../../UI/bookingDetail/BookingDetail";
import { ListGroup, Tab, Row, Col } from "react-bootstrap";
import BookingCard from "./components/BookingCard";
import "./styles/myOnlineBooking.scss";

function MyOnlineBooking(props) {
  const handleKeyPress = event => {
    if (event.key === "Enter") {
      props.handleSearch();
    }
  };

  return (
    <main className="mybooking">
      <section className="mybooking__left">
        <h2 className="mybooking__title">Booking List</h2>
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

export default MyOnlineBooking;
