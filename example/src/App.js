import React, { Component } from "react";
import hoursJson from "./hours.json";
import businessHours from "business-hours.js";
import Clock from "react-live-clock";
import "./App.css";

class App extends Component {
  componentWillMount() {
    businessHours.init(hoursJson);
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1>business-hours.js Example</h1>
          <h3>
            {" "}
            Browser timezone:{" "}
            <Clock format={"HH:mm on dddd, MMMM Do YYYY z"} ticking={true} />
          </h3>
          <h3>
            {" "}
            Business timezone:{" "}
            <Clock
              format={"HH:mm on dddd, MMMM Do YYYY z"}
              ticking={true}
              timezone={hoursJson.timeZone}
            />
          </h3>

          <p className="App-intro">
            The business is currently:{" "}
            {businessHours.isOpenNow() ? (
              <span className="open">OPEN</span>
            ) : (
              <span className="open">CLOSED</span>
            )}
          </p>
          <p>
            Next opening hour:{" "}
            {businessHours.nextOpeningHour().format("YYYY-MM-DD HH:mm z")}
          </p>
        </header>
        <h2>Defined business hours:</h2>
        <p>
          Monday: <br />10:00-13:30 and 18:00-22:00
        </p>
        <p>
          Thuesday: <br />CLOSED
        </p>
        <p>
          Wednesday: <br />10:00-13:30 and 18:00-22:00
        </p>
        <p>
          Thursday: <br />10:00-13:30 and 18:00-22:00
        </p>
        <p>
          Friday: <br />10:00-13:30 and 18:00-22:00
        </p>
        <p>
          Satuday: <br />10:00-13:30 and 18:00-22:00
        </p>
        <p>
          Sunday: <br />10:00-13:30 and 17:00-20:00 and 21:00-24:00
        </p>
      </div>
    );
  }
}

export default App;
