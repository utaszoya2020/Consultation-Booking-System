import React from "react";
import RightArrow from "../../../assets/icon/iconfinder_icon-ios7-arrow-right_211607.svg";
import "../styles/bookingCard.scss";

function BookingCard() {
    return (
      <div className="booking-card">
        <a>
          <p className="booking-card__text">
            <strong>John</strong> (412456)
          </p>
          <p className="booking-card__text">
            <strong>Subject</strong>: somethings
          </p>
          <p className="booking-card__text">
            <strong>Status</strong>: open
          </p>
          <img
            className="booking-card__img"
            src={RightArrow}
            alt="right arrow"
          />
        </a>
      </div>
    );
}

export default BookingCard;