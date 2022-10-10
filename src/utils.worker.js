/* ******************************************************************************
 * Classification: UNCLASSIFIED
 ***************************************************************************** */

import * as Utils from "./utils";

function respond(data, event) {
  const obj = { _id: event.data._id, data };
  const returnobj = JSON.parse(JSON.stringify(obj));
  self.postMessage(returnobj);
}

self.addEventListener("message", (event) => {
  switch (event.data.type) {
    // Basic case that just responds a string
    case "bigProcess": {
      console.log("worker", "starting bigProcess");
      respond(Utils.bigProcess(event.data.args[0]), event);
      break;
    }
    case "getDataFromFetch": {
      Utils.getDataFromFetch().then((res) => {
        respond(res, event);
      });
      break;
    }
    case "getFavorites": {
      /**
       * Why is Utils.getFavorites() undefined here?
       */
      respond(Utils.getFavorites(), event);
      break;
    }
    case "passFavoritesToWorker": {
      // Pass the favorites array straight back
      respond(event.data.args[0], event);
      break;
    }
    default:
      break;
  }
});
