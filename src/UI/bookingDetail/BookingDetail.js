import React from "react";
import "./bookingDetail.scss";

function BookingDetail() {
    return (
      <div className="homepage__mybooking">
        <h5 className="booking__title">Ticket Number: 000</h5>
        <p><strong>Date</strong>: 10/08/1019 15:00</p>
        <p><strong>Campus</strong>: Hobart</p>
        <p><strong>Subject</strong>: Finance</p>
        <p><strong>Status</strong>: Your request is approved!</p>
      </div>
    );
}

export default BookingDetail;