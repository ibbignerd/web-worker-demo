/* ******************************************************************************
 * Classification: UNCLASSIFIED
 ***************************************************************************** */

import React from "react";
import { Table, Button } from "react-bootstrap";

import WebWorker from "./WebWorker";
import UtilsWorker from "./utils.worker.js";
import * as Utils from "./utils";

export default class DoWork extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      useWorker: false,
    };
  }

  static _generateNiceString(type, startTime, worker) {
    return `${worker ? "$$$ WORKER" : "--- MAIN"} ${type} took ${
      performance.now() - startTime
    }ms`;
  }

  _doWork = (type) => {
    const startTime = performance.now();
    console.info(`################### Starting ${type} ###################`);
    switch (type) {
      /**
       * Create a new web worker if one hasn't been created already
       * Notice under the sources tab how the second thread is shown
       */
      case "createWorker": {
        if (!this.utilWorker) {
          this.utilWorker = new WebWorker(UtilsWorker);
          console.info("Created a web worker. Check out the `Sources` tab");
        } else {
          console.info("worker has already been created");
        }
        break;
      }
      /**
       * Run an intensive, blocking process for 8 seconds
       */
      case "bigProcess": {
        if (this.state.useWorker) {
          this.utilWorker
            .postMessage({
              type: "bigProcess",
              args: [4000],
            })
            .then(() => {
              console.log(DoWork._generateNiceString(type, startTime, true));
            });
        } else {
          Utils.bigProcess(4000);
          console.log(DoWork._generateNiceString(type, startTime, false));
        }
        break;
      }
      /**
       * Get data from an endpoint via fetch
       */
      case "getDataFromFetch": {
        if (this.state.useWorker) {
          this.utilWorker
            .postMessage({
              type: "getDataFromFetch",
              args: [],
            })
            .then((res) => {
              console.log(DoWork._generateNiceString(type, startTime, true));
              console.log(res);
            });
        } else {
          Utils.getDataFromFetch().then((res) => {
            console.log(DoWork._generateNiceString(type, startTime, false));
            console.log(res);
          });
        }
        break;
      }
      /**
       * Get the favorites array from UserPrefs
       * The Worker will fail because it can't get the instance of the userPrefs
       */
      case "getFavorites": {
        if (this.state.useWorker) {
          this.utilWorker
            .postMessage({
              type: "getFavorites",
              args: [],
            })
            .then((res) => {
              console.log(DoWork._generateNiceString(type, startTime, true));
              console.log(res);
            });
        } else {
          console.log(Utils.getFavorites());
          console.log(DoWork._generateNiceString(type, startTime, false));
        }
        break;
      }
      /**
       * Get the favorites here on the main thread and pass it to the worker
       */
      case "passFavoritesToWorker": {
        if (this.state.useWorker) {
          this.utilWorker
            .postMessage({
              type: "passFavoritesToWorker",
              args: [Utils.getFavorites()],
            })
            .then((res) => {
              console.log(DoWork._generateNiceString(type, startTime, true));
              console.log(res);
            });
        } else {
          console.log("switch to using a worker for this one");
        }
        break;
      }
      /**
       * Runs each of these types through a JSON.parse(JSON.stringify())
       */
      case "canItSerialize": {
        const myObject = {
          string: "myString",
          number: 123,
          boolean: true,
          null: null,
          Object: { a: 1, b: 2 },
          Array: [1, 2, 3, "a", "b"],
          ClassParams: Utils.getFavorites(),
          _ClassInstance: Utils.getInstance(),
          _Symbol: Symbol("disappears"),
          _undefined: undefined,
          _arrayWithSymbol: [1, 2, 3, Symbol("in array"), 5],
          _objectWithSymbol: { a: 1, b: 2, sym: Symbol("in object") },
          _objectWithFunc: {
            a: 1,
            b: 2,
            callback: () => {
              console.log("do stuff");
            },
          },
        };
        console.log("before:", myObject);
        console.log("after:", JSON.parse(JSON.stringify(myObject)));
        console.log(
          "-----------------------------------------------------------------------"
        );
        Utils.canItSerialize("string", "myString");
        Utils.canItSerialize("number", 123);
        Utils.canItSerialize("boolean", true);
        Utils.canItSerialize("null", null);
        Utils.canItSerialize("Object", { a: 1, b: 2 });
        Utils.canItSerialize("Array", [1, 2, 3, "a", "b"]);
        Utils.canItSerialize("ClassParams", Utils.getFavorites());
        Utils.canItSerialize("Symbol", Symbol("converts to null"));
        Utils.canItSerialize("undefined", undefined);
        break;
      }
      case "createNew": {
        if (this.state.useWorker) {
          console.log("Using the original worker");
          this.utilWorker
            .postMessage({
              type: "bigProcess",
              args: [4000],
            })
            .then(() => {
              console.log(DoWork._generateNiceString(type, startTime, true));
            });
        } else {
          console.log("Using a new worker");
          let endTime;
          const newWorker = new WebWorker(UtilsWorker);
          newWorker
            .postMessage({
              type: "bigProcess",
              args: [4000],
            })
            .then(() => {
              console.log(DoWork._generateNiceString(type, startTime, true));
              endTime = performance.now();

              /**
               * NEVER try to terminate inside your then statement. It never gets
               * called because it is waiting for this postMessage to resolve.
               */
              //   newWorker.terminate().then(() => {
              //     console.log(
              //       "time it took to spin up, do work, and terminate worker",
              //       performance.now() - startTime
              //     );
              //   });
            });
          // Will automatically terminate once the message queue is cleared
          newWorker.terminate().then(() => {
            console.log(
              "time it took to terminate worker",
              performance.now() - endTime
            );
          });
        }
        break;
      }
      default:
        break;
    }
  };

  generateTableRow = (title, callType, paragraph, doesUseWorker) => (
    <tr>
      <td>
        <Button onClick={() => this._doWork(callType)}>{title}</Button>
      </td>
      <td>{doesUseWorker ? "worker" : ""}</td>
      <td>{paragraph}</td>
    </tr>
  );

  render() {
    return (
      <React.Fragment>
        <Button
          onClick={() => this.setState({ useWorker: !this.state.useWorker })}
        >
          {this.state.useWorker ? "Using web worker" : "Using main thread"}
        </Button>
        <Table style={{ width: "90vw", margin: "20px" }}>
          <tbody>
            {this.generateTableRow(
              "Create webworker",
              "createWorker",
              "Spin up the worker we are going to use for this demo.",
              false
            )}
            {this.generateTableRow(
              "Can it serialize?",
              "canItSerialize",
              "Print a list of different Javascript data types and check if they can be serialized",
              false
            )}
            {this.generateTableRow(
              "While loop",
              "bigProcess",
              "Run a while loop for 8 seconds. This simulates processing a large dataset",
              true
            )}
            {this.generateTableRow(
              "Get Data",
              "getDataFromFetch",
              "Get some data from an endpoint",
              true
            )}
            {this.generateTableRow(
              "Call Utils.getFavorites()",
              "getFavorites",
              "Get the favorites array from UserPrefs through Utils.js",
              true
            )}
            {this.generateTableRow(
              "Pass ClassParams to the worker",
              "passFavoritesToWorker",
              "Pass the favorites object to the web worker",
              true
            )}
            {this.generateTableRow(
              "Cost to create",
              "createNew",
              "Cost of creating and destroying a new worker. Processes for 4 seconds",
              true
            )}
          </tbody>
        </Table>
      </React.Fragment>
    );
  }
}
