/* ******************************************************************************
 * Classification: UNCLASSIFIED
 ***************************************************************************** */

/**
 * Creates a web worker and manages the messages as promises
 * @author Nathan Diddle
 */
export default class WebWorker {
  constructor(MyWorker) {
    /** @type {Worker} */
    this._worker = new MyWorker();
    // this._worker = new Worker(URL.createObjectURL(new Blob(["("+MyWorker.toString()+")()"], {type: 'text/javascript'})));
    /**
     * Queue of messages sent to the worker
     */
    this._messages = [];
    this._terminate;

    /**
     * Listens for messages from this._worker
     */
    this._worker.onmessage = (event) => {
      const messageIndex = this._messages.findIndex(
        (item) => item._id === event.data._id
      );
      const removed = this._messages.splice(messageIndex, 1)[0];
      removed.resolve(event.data.data);
      if (this._terminate && this._messages.length === 0) {
        this._worker.terminate();
        this._terminate();
      }
    };
  }

  /**
   * @typedef {{
                type: string,
                args: Array,
              }} dataType
   * @param {dataType} data - to be passed to worker
   */
  postMessage(data) {
    if (this._terminate) {
      throw new Error(
        "Cannot post message. Worker already marked for termination"
      );
    }
    // create random id
    const _id = Math.floor(Math.random() * 1000000);

    // Send to worker
    this._worker.postMessage({
      ...data,
      _id,
    });
    // Return a promise which gets resolved when the message
    // comes back from the worker
    return new Promise((resolve, reject) => {
      this._messages.push({
        _id,
        resolve,
        reject,
      });
    });
  }

  /**
   * @returns {boolean} if the worker is alive
   */
  isAlive() {
    return !this._terminate;
  }

  /**
   * Worker will be terminated once this._messages queue is cleared
   */
  async terminate(force = false) {
    if (force) {
      this._worker.terminate();
      return Promise.resolve();
    }
    return new Promise((resolve) => {
      this._terminate = resolve;
    });
  }
}
