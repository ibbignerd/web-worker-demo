/* ******************************************************************************
 * Classification: UNCLASSIFIED
 ***************************************************************************** */

/**
 * POJO singleton which gets instantiated and preferences updated
 */
class UserPrefManager {
  constructor() {
    this._favorites = [];
  }

  /**
   * @type {string[]}
   */
  get favorites() {
    return this._favorites;
  }

  set favorites(newFavs) {
    this._favorites = newFavs;
  }

  addFavorite(input) {
    this._favorites.push(input);
  }
}

const instance = new UserPrefManager();

export default instance;
