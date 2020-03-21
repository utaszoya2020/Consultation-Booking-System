import React from "react";
import BookiingDetail from "../../UI/bookingDetail/BookingDetail";
import "./styles/home.scss";

function Home() {
  return (
    <div className="homepage">
      <div className="homepage__block">
        <h1 className="homepage__title">
          Welcome Dom, You have 2 up comming booking!
        </h1>
      </div>
        <BookiingDetail />
        <BookiingDetail />
    </div>
  );
}

export default Home;
