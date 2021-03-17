import React from "react";
import ReactDOM from "react-dom";

import App from "./component/App";

import { DataProvider } from "./context/DataContext";

import "./style.css";

ReactDOM.render(
  <React.StrictMode>
    <DataProvider>
      <App />
    </DataProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
