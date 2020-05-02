import React from "react";
import { Result, Button } from "antd";
import { STUDENT_HOME_URL } from "../../routes/URLMap";

function ErrorMessage() {
  return (
    <div className="message__container">
      <Result
        status="404"
        title="404"
        subTitle="Sorry, the page you visited does not exist."
        extra={
          <Button type="primary" href={STUDENT_HOME_URL}>
            Back Home
          </Button>
        }
      />
    </div>
  );
}

export default ErrorMessage;
