import React, { useState, useRef, Component } from "react";
import { Form, Col, Row, Button, FormControl, Modal } from "react-bootstrap";
import { Upload, message } from "antd";
import { InboxOutlined } from "@ant-design/icons";
import Calendar from "react-calendar";
import TimePicker from "./components/TimePicker";
import Confirm from "../../UI/confirm/Confirm";
import "./styles/faceToFaceBooking.scss";

class FaceToFaceBooking extends Component {
  constructor(props) {
    super(props);
    this.state = {
      date: new Date(),
      modalShow: false,
      setModalShow: false,
      content: "",
      setContent: ""
    };
    this.ref = {
      editor: null
    };
  }

  onChange = date => this.setState({ date });

  render() {
    const { modalShow, setModalShow, content, setContent } = this.state;

    const { editor } = this.ref;
    const config = {
      readonly: false
    };
    const { Dragger } = Upload;
    const props = {
      name: "file",
      multiple: true,
      action: "https://www.mocky.io/v2/5cc8019d300000980a055e76",
      onChange(info) {
        const { status } = info.file;
        if (status !== "uploading") {
          console.log(info.file, info.fileList);
        }
        if (status === "done") {
          message.success(`${info.file.name} file uploaded successfully.`);
        } else if (status === "error") {
          message.error(`${info.file.name} file upload failed.`);
        }
      }
    };

    return (
      <div className="online-booking">
        <Confirm show={modalShow} onHide={() => setModalShow(false)} />
        <div className="online-booking__title">
          <h3>Face To Face Consultation</h3>
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

          <Form.Group as={Row} controlId="formPlaintextSubject">
            <Form.Label column="lg" lg={2}>
              Subject
            </Form.Label>
            <Col lg="10">
              <Form.Control type="text" placeholder="Subject" />
            </Col>
          </Form.Group>

          <Form.Group as={Row} controlId="formHorizontalContent">
            <Form.Label column="lg" lg={2}>
              Date
            </Form.Label>
            <Col lg={10}>
              <div className="booking__calander">
                <Calendar onChange={this.onChange} value={this.state.date} />
                <TimePicker />
              </div>
            </Col>
          </Form.Group>

          <Form.Group as={Row} controlId="formHorizontalAttachment">
            <Form.Label column="lg" lg={2}>
              Attachment
            </Form.Label>
            <Col lg={10}>
              <Dragger {...props}>
                <p className="ant-upload-drag-icon">
                  <InboxOutlined />
                </p>
                <p className="ant-upload-text">
                  Click or drag file to this area to upload
                </p>
                <p className="ant-upload-hint">
                  Support for a single or bulk upload. Strictly prohibit from
                  uploading company data or other band files
                </p>
              </Dragger>
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
  }
}

export default FaceToFaceBooking;
