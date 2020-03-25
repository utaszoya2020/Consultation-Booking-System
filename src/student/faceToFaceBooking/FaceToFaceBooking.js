import React, { useState, useRef, Component } from "react";
import { Form, Col, Row, Button, FormControl, Modal } from "react-bootstrap";
import { Upload, message } from "antd";
import { InboxOutlined } from "@ant-design/icons";
import Calendar from "react-calendar";
import TimePicker from "./components/TimePicker";
import Confirm from "../../UI/confirm/Confirm";
import { FACE_TO_FACE_BOOKING_URL } from "../../routes/URLMap";
import "./styles/faceToFaceBooking.scss";

class FaceToFaceBooking extends Component {
  constructor(props) {
    super(props);
    this.state = {
      date: new Date(),
      modalShow: false,
      setModalShow: false,
      content: "",
      setContent: "",
      clickFlag: false,
      timeString: ""
    };
    this.ref = {
      editor: null
    };
  }

  onChange = date => this.setState({ date });

  tileDisabled = ({ date, view }) => date.getDay() === 6 || date.getDay() === 0;

  handleTimeChange = event => {
    const key = event.target.name;
    const value = event.target.value;
    const timeString = event.target.innerHTML;

    this.setState({
      [key]: value,
      timeString
    });
  };

  handleSubmit = () => {
      this.setState({ modalShow: true });
      console.log("ok");
  }

  hideModel = () => {
      this.setState({ modalShow: false });
  }

  dateFormat = (fmt, date) => {
    let ret;
    const opt = {
      "Y+": date.getFullYear().toString(),
      "m+": (date.getMonth() + 1).toString(),
      "d+": date.getDate().toString()
    };
    for (let k in opt) {
      ret = new RegExp("(" + k + ")").exec(fmt);
      if (ret) {
        fmt = fmt.replace(
          ret[1],
          ret[1].length == 1 ? opt[k] : opt[k].padStart(ret[1].length, "0")
        );
      }
    }
    return fmt.slice(0, 10);
  };

  render() {
    const {
      modalShow,
      setModalShow,
      content,
      setContent,
      timeString,
      date
    } = this.state;
    const selectDate = this.dateFormat("YYYY-mm-dd HH:MM", date);

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
        <Confirm show={modalShow} onHide={this.hideModel} />
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
              {timeString === "" ? null : (
                <h5 className="booking__block">{`${selectDate}  ${timeString}`}</h5>
              )}
              <div className="booking__calander">
                <Calendar
                  onChange={this.onChange}
                  value={this.state.date}
                  tileDisabled={this.tileDisabled}
                />
                <TimePicker handleTimeChange={this.handleTimeChange} />
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
              <Button variant="primary" onClick={this.handleSubmit}>
                Submit
              </Button>
              <Button
                variant="outline-secondary"
                type="reset"
                href={FACE_TO_FACE_BOOKING_URL}
              >
                Reset
              </Button>
            </Col>
          </Form.Group>
        </Form>
      </div>
    );
  }
}

export default FaceToFaceBooking;
