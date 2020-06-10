import React, { Fragment } from 'react';
import { NavLink, withRouter } from 'react-router-dom';
import { Navbar, Nav, NavDropdown, Button } from 'react-bootstrap';
import { isAdmin, isAuthenticated, deleteToken } from '../utils/authentication';
import AIBTLogo from '../assets/logo__aibt.png';
import {
    STUDENT_HOME_URL,
    MY_ONLINE_BOOKING_URL,
    MY_FACETOFACE_BOOKING_URL,
    FACE_TO_FACE_BOOKING_URL,
    ONLINE_BOOKING_URL,
    ADMIN_HOME_URL,
    ADMIN_SCHEDULING_URL,
    LOGOUT_SUCCESS_URL,
} from '../routes/URLMap.js';

import './Header.scss';

class Header extends React.Component {
    constructor(props) {
        super(props);

        this.state = {};
    }

    handleLogOut = (history) => {
        deleteToken();
        history.push(LOGOUT_SUCCESS_URL);
    };

    renderAdminNavbar = () => {
        return (
            <Fragment>
                <Nav className='mr-auto'>
                    <NavLink className='nav-left_brand' to={ADMIN_HOME_URL}>
                        <Nav.Link href={ADMIN_HOME_URL}>Home</Nav.Link>
                    </NavLink>
                    <NavLink className='nav-left__nav-item' to={ADMIN_SCHEDULING_URL}>
                        <Nav.Link href={ADMIN_SCHEDULING_URL}>Scheduling</Nav.Link>
                    </NavLink>
                </Nav>
            </Fragment>
        );
    };

    renderStudentNavbar = () => {
        return (
            <Fragment>
                <Nav className='mr-auto'>
                    <NavLink className='nav-left_brand' to={STUDENT_HOME_URL}>
                        <Nav.Link href={STUDENT_HOME_URL}>Home</Nav.Link>
                    </NavLink>
                    <NavDropdown
                        title='My Booking'
                        id='collasible-nav-dropdown'
                    >
                        <NavLink
                            className='nav-left_brand'
                            to={MY_ONLINE_BOOKING_URL}
                        >
                            <NavDropdown.Item href={MY_ONLINE_BOOKING_URL}>
                                Online
                            </NavDropdown.Item>
                        </NavLink>
                        <NavDropdown.Divider />
                        <NavLink
                            className='nav-left_brand'
                            to={MY_FACETOFACE_BOOKING_URL}
                        >
                            <NavDropdown.Item href={MY_FACETOFACE_BOOKING_URL}>
                                Face-To-Face
                            </NavDropdown.Item>
                        </NavLink>
                    </NavDropdown>
                    <NavLink className='nav-left_brand' to={ONLINE_BOOKING_URL}>
                        <Nav.Link href={ONLINE_BOOKING_URL}>
                            Start Online Consultation
                        </Nav.Link>
                    </NavLink>
                    <NavLink
                        className='nav-left_brand'
                        to={FACE_TO_FACE_BOOKING_URL}
                    >
                        <Nav.Link href={FACE_TO_FACE_BOOKING_URL}>
                            Book Face-to-face Consultation
                        </Nav.Link>
                    </NavLink>
                </Nav>
            </Fragment>
        );
    };

    render() {
        const { history } = this.props;
        return (
            isAuthenticated() ? (
                <Navbar collapseOnSelect expand='lg' bg='dark' variant='dark'>
                    <Navbar.Brand href='#'>
                        <img
                            src={AIBTLogo}
                            width='237'
                            className='d-inline-block align-top header__img'
                            alt='AIBT logo'
                        />
                    </Navbar.Brand>
                    <Navbar.Toggle aria-controls='responsive-navbar-nav' />
                    <Navbar.Collapse id='responsive-navbar-nav'>
                        {isAdmin()
                            ? this.renderAdminNavbar(history)
                            : this.renderStudentNavbar(history)}
                        <Button
                            variant='danger'
                            as='button'
                            className='c-btn__logout'
                            onClick={() => this.handleLogOut(history)}
                        >
                            Log Out
                        </Button>
                    </Navbar.Collapse>
                </Navbar>
            ) : null
        );
    }
}

export default withRouter(Header);
