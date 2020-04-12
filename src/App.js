import React from "react";
import Routers from "./routes/Routes";
import { BrowserRouter } from "react-router-dom";
import Header from "./header/Header";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  return (
    <BrowserRouter>
      <Header />
      <div className="body">
      <Routers />
      </div>
    </BrowserRouter>
  );
}

export default App;
