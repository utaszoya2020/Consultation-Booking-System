import React from "react";

import "../styles/timePicker.scss";

function TimePicker() {
    return (
      <div className="c-timepicker">
        <table className="c-timepicker__table">
          <tr>
            <td>
              <a>
                <span className="c-timepicker__text">9:00 - 9:50</span>
              </a>
            </td>
          </tr>
          <tr>
            <td>
              <a>
                <span className="c-timepicker__text">10:00 - 10:50</span>
              </a>
            </td>
          </tr>
          <tr>
            <td>
              <a>
                <span className="c-timepicker__text">11:00 - 11:50</span>
              </a>
            </td>
          </tr>
          <tr>
            <td>
              <a>
                <span className="c-timepicker__text">13:00 - 13:50</span>
              </a>
            </td>
          </tr>
          <tr>
            <td>
              <a>
                <span className="c-timepicker__text">14:00 - 14:50</span>
              </a>
            </td>
          </tr>
          <tr>
            <td>
              <a>
                <span className="c-timepicker__text">15:00 - 15:50</span>
              </a>
            </td>
          </tr>
          <tr>
            <td>
              <a>
                <span className="c-timepicker__text">16:00 - 16:50</span>
              </a>
            </td>
          </tr>
        </table>
      </div>
    );
}

export default TimePicker;