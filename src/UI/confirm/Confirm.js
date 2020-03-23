import React, { useState, useRef } from "react";
import { Modal, Button } from "react-bootstrap";
import { SUCCESS_URL } from "../../routes/URLMap";

function Confirm(props) {
  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          Confirmation
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>Are you sure?</p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={props.onHide}>
          Close
        </Button>
        <Button variant="primary" onClick={props.onHide} href={SUCCESS_URL}>
          Confirm
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default Confirm;
