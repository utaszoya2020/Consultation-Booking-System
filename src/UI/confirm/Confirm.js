import React from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { Modal, Button } from 'react-bootstrap';
import { addBookingThunkAction } from '../../redux/actions/bookingAction';
import { SUCCESS_URL, ERROR_URL } from '../../routes/URLMap';

function Confirm(props) {
    const {
        type,
        campus,
        userId,
        topic,
        subject,
        content,
        bookingDate,
        attachment,
        isPosted,
        error,
    } = props;

    let successRedirector = null;
    if (isPosted) {
        successRedirector = <Redirect to={SUCCESS_URL} />;
    }

    let failureRedirector = null;
    if (error) {
        failureRedirector = <Redirect to={ERROR_URL} />;
    }

    return (
        <Modal
            {...props}
            size='lg'
            aria-labelledby='contained-modal-title-vcenter'
            centered
        >
            {successRedirector}
            {failureRedirector}
            <Modal.Header closeButton>
                <Modal.Title id='contained-modal-title-vcenter'>
                    Confirmation
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p>Are you sure?</p>
            </Modal.Body>
            <Modal.Footer>
                <Button variant='secondary' onClick={props.onHide}>
                    Close
                </Button>
                <Button
                    variant='primary'
                    onClick={() => {
                        props.handleAddBooking(
                            type,
                            campus,
                            userId,
                            topic,
                            subject,
                            content,
                            bookingDate,
                            attachment
                        );
                    }}
                >
                    Confirm
                </Button>
            </Modal.Footer>
        </Modal>
    );
}

const mapStateToProps = (state) => ({
    isPosted: state.booking.isPosted,
    error: state.booking.error,
    isLoading: state.booking.isLoading,
});

const mapDispatchToProps = (dispatch) => ({
    handleAddBooking: (
        type,
        campus,
        userId,
        topic,
        subject,
        content,
        bookingDate,
        attachment
    ) =>
        dispatch(
            addBookingThunkAction(
                type,
                campus,
                userId,
                topic,
                subject,
                content,
                bookingDate,
                attachment
            )
        ),
});

export default connect(mapStateToProps, mapDispatchToProps)(Confirm);
