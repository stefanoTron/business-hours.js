import React, { Component } from "react";
import hoursJson from "./hours.json";
import businessHours from "business-hours.js";
import "./App.css";

class App extends Component {
  componentWillMount() {
    businessHours.init(hoursJson);
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <p className="App-intro">
            Is open now? {businessHours.isOpenNow().toString()}
          </p>
          <p>Next opening hour: {businessHours.nextOpeningHour().toString()}</p>
          <p>
            Is it open tomorrow? {businessHours.isOpenTomorrow().toString()}
          </p>
        </header>
        <h1>business-hours.js Example</h1>
        <p>
          Sunday: <br />10:00-13:30 and 17:00-20:00 and 21:00-24:00
        </p>
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
      </div>
    );
  }
}

export default App;
