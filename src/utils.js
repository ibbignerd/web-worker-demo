/* ******************************************************************************
 * Classification: UNCLASSIFIED
 ***************************************************************************** */
import _ from "lodash";
import UserPrefs from "./userPrefs";

/**
 * Pure functions which can be used by both the main and the worker threads
 */

/**
 * Delay the thread for `delay` ms
 * @param {number} delay - in ms
 * @returns {number} actual time of delay in ms
 * @private
 */
export function bigProcess(delay) {
  const start = performance.now();

  // lock thread until delay time has passed
  while (performance.now() - start < delay);
  const end = performance.now();
  return end - start;
}

/**
 * Get data from an endpoint and return the json
 */
export function getDataFromFetch() {
  return fetch(
    "https://jsonplaceholder.typicode.com/todos/1"
  ).then((response) => response.json());
}

/**
 * Try to serialize the val
 * @param {String} name - label for the value
 * @param {*} val - Item to be serialized
 */
export function canItSerialize(name, val) {
  console.group(name);
  let serializedVal;
  try {
    serializedVal = JSON.parse(JSON.stringify(val));
    if (_.isEqual(val, serializedVal)) {
      console.info(`No problem serializing a ${name}`);
      console.log(serializedVal);
    }
  } catch (e) {
    console.error(`Tried to serialize a ${name}, but this is what came out:`);
    console.log(serializedVal);
  }
  console.groupEnd();
}

/******************** NOT PURE *********************/

/**
 * Return the instance of UserPrefs
 */
export function getInstance() {
  return UserPrefs;
}

/**
 * Get the favorites from UserPrefs
 */
export function getFavorites() {
  return UserPrefs.favorites;
}
