import React, { useState, useRef } from "react";
import { Form, Col, Row, Button, FormControl, Modal } from "react-bootstrap";
import JoditEditor from "jodit-react";
import Confirm from "../../UI/confirm/Confirm";
import "./onlineBooking.scss";

const OnlineBooking = ({}) => {
  const [modalShow, setModalShow] = React.useState(false);
  const editor = useRef(null);
  const [content, setContent] = useState("");
  const config = {
    readonly: false
  };

  return (
    <div className="online-booking">
      <Confirm show={modalShow} onHide={() => setModalShow(false)} />
      <div className="online-booking__title">
        <h3>Online Consultation</h3>
      </div>
      <Form>
        <Form.Group as={Row} controlId="formHorizontalTopic">
          <Form.Label column="lg" lg={2}>
            Topic
          </Form.Label>
          <Col lg={10}>
            <Form.Control as="select" value="Choose...">
              <option>Finance...</option>
              <option>Accommodation...</option>
              <option>Cource...</option>
              <option>Others...</option>
            </Form.Control>
          </Col>
        </Form.Group>

        <Form.Group as={Row} controlId="formHorizontalContent">
          <Form.Label column="lg" lg={2}>
            Content
          </Form.Label>
          <Col lg={10}>
            <JoditEditor
              ref={editor}
              value={content}
              config={config}
              tabIndex={1} // tabIndex of textarea
              onBlur={newContent => setContent(newContent)} // preferred to use only this option to update the content for performance reasons
              onChange={newContent => {}}
            />
          </Col>
        </Form.Group>

        <Form.Group as={Row} controlId="formHorizontalAttachment">
          <Form.Label column="lg" lg={2}>
            Attachment
          </Form.Label>
          <Col lg={10}>
            <form className="uploader" encType="multipart/form-data">
              <input type="file" id="myFile" name="filename" multiple />
            </form>
          </Col>
        </Form.Group>

        <Form.Group as={Row}>
          <Col lg={{ span: 10, offset: 2 }}>
            <Button variant="primary" onClick={() => setModalShow(true)}>
              Submit
            </Button>
            <Button
              variant="outline-secondary"
              onClick={() => setModalShow(true)}
            >
              Cancel
            </Button>
          </Col>
        </Form.Group>
      </Form>
    </div>
  );
};

export default OnlineBooking;
