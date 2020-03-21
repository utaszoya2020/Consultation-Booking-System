import React from "react";
import Routers from "./routes/Routes";
import Header from "./header/Header";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  return (
    <React.Fragment>
      <Header />
      <Routers />
    </React.Fragment>
  );
}

export default App;
