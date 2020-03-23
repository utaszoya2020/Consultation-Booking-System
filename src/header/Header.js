import React from "react";
import { NavLink, withRouter } from "react-router-dom";
import { Navbar, Nav, NavDropdown } from "react-bootstrap";
import AIBTLogo from "../assets/logo__aibt.png";
import {
  STUDENT_HOME_BASE_URL,
  MY_ONLINE_BOOKING_URL,
  MY_FACETOFACE_BOOKING_URL,
  FACE_TO_FACE_BOOKING_URL,
  ONLINE_BOOKING_URL
} from "../routes/URLMap.js";

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
          <NavLink className="nav-left_brand" to={STUDENT_HOME_BASE_URL}>
            <Nav.Link href={STUDENT_HOME_BASE_URL}>Home</Nav.Link>
          </NavLink>
          <NavDropdown title="My Booking" id="collasible-nav-dropdown">
            <NavLink className="nav-left_brand" to={MY_ONLINE_BOOKING_URL}>
              <NavDropdown.Item href={MY_ONLINE_BOOKING_URL}>
                Online
              </NavDropdown.Item>
            </NavLink>
            <NavDropdown.Divider />
            <NavLink className="nav-left_brand" to={MY_FACETOFACE_BOOKING_URL}>
              <NavDropdown.Item href={MY_FACETOFACE_BOOKING_URL}>
                Face-To-Face
              </NavDropdown.Item>
            </NavLink>
          </NavDropdown>
          <NavLink className="nav-left_brand" to={ONLINE_BOOKING_URL}>
            <Nav.Link href={ONLINE_BOOKING_URL}>
              Start Online Consultation
            </Nav.Link>
          </NavLink>
          <NavLink className="nav-left_brand" to={FACE_TO_FACE_BOOKING_URL}>
            <Nav.Link href={FACE_TO_FACE_BOOKING_URL}>
              Book Face-to-face Consultation
            </Nav.Link>
          </NavLink>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
}

export default Header;
