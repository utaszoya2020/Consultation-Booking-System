import React from "react";
import { NavLink, withRouter } from "react-router-dom";
import { Navbar, Nav } from "react-bootstrap";
import AIBTLogo from "../assets/logo__aibt.png";
import "./Header.scss";

function Header() {
  return (
    <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
      <Navbar.Brand href="#home">
        <img
          src={AIBTLogo}
          width="237"
          className="d-inline-block align-top header__img"
          alt="AIBT logo"
        />
      </Navbar.Brand>
      <Navbar.Toggle aria-controls="responsive-navbar-nav" />
      <Navbar.Collapse id="responsive-navbar-nav">
        <Nav className="mr-auto">
          <Nav.Link href="#home">
            Home
          </Nav.Link>
          <Nav.Link href="#link">My Booking</Nav.Link>
          <Nav.Link href="#link">Start Online Consultation</Nav.Link>
          <Nav.Link href="#link">Book Face-to-face Consultation</Nav.Link>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
}

export default Header;
