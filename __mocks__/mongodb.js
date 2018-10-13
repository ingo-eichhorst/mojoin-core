const albums = require('../examples/datasource/albums.json')
/**
 * Mock of MongoClient from mongodb
 */
const MongoClient = {
  /**
   * mocked mongodb connection
   */
  connect (url, options, callback) {
    if (!callback) callback = options
    return callback(null, {
      /**
       * Mock DB object
       * @param {string} name
       */
      db (name) {
        return this
      },
      /**
       * Mock collection
       * @param {*} name
       */
      collection (name) {
        return {
          /**
           * Mock find
           */
          find () {
            return this
          },
          /**
           * Mock toArray
           */
          toArray () {
            return albums
          },

          /**
           * Mock limit
           *
           * @param {number} limit
           */
          limit (limit) {
            return this
          },

          /**
           * Mock offset
           * @param {number} offset
           */
          skip (offset) {
            return this
          }
        }
      },
      /**
       * Mock DB close
       */
      close () {
        return true
      }
    })
  }
}

module.exports = {
  MongoClient
}
