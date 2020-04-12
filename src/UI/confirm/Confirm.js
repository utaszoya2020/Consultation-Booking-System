import React from 'react';
import { connect } from 'react-redux';
import { Modal, Button } from 'react-bootstrap';
import { addBookingThunkAction } from '../../redux/actions/bookingAction';


function Confirm(props) {
    const {
        type,
        campus,
        userId,
        topic,
        subject,
        content,
        isBookingSuccess,
    } = props;

    return (
        <Modal
            {...props}
            size='lg'
            aria-labelledby='contained-modal-title-vcenter'
            centered
        >
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
                            content
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
    isBookingSuccess: state.booking.newBooking !== {},
});

const mapDispatchToProps = (dispatch) => ({
    handleAddBooking: (type, campus, userId, topic, subject, content) =>
        dispatch(
            addBookingThunkAction(type, campus, userId, topic, subject, content)
        ),
});

export default connect(mapStateToProps, mapDispatchToProps)(Confirm);
