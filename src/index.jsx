/* ******************************************************************************
 * Classification: UNCLASSIFIED
 ***************************************************************************** */

import React from "react";
import { render } from "react-dom";

import UserPrefs from "./userPrefs";
import DoWork from "./doWork.jsx";
import "./index.scss";

/**
 * Instantiate the user preferences and set some favorites
 */
UserPrefs.favorites = ["apple", "banana", "peach"];

const App = () => (
  <div>
    <DoWork />
    <div id="fps" />
  </div>
);

render(<App />, document.getElementById("app"));

/**
 * Create the FPSish indicator
 */
const fps = document.getElementById("fps");
let counter = 0;
setInterval(() => {
  fps.innerText = `${counter++}`;
  if (counter > 100000000) {
    counter = 0;
  }
}, 100);
