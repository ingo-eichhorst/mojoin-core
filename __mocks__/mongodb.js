const albums = require('../examples/datasource/albums.json')

/**
 * builds a mock collection object
 *
 * @param {string} name
 * @returns {object} collection
 */
function buildCollection (name) {
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
      const offset = this.offset ? this.offset : 0
      const limit = this.limit ? this.limit : albums.length
      return albums.slice(offset, limit + offset)
    },

    /**
     * Mock limit
     *
     * @param {number} limit
     */
    limit (limit) {
      this.limit = limit
      return this
    },

    /**
     * Mock offset
     * @param {number} offset
     */
    skip (offset) {
      this.offset = offset
      return this
    }
  }
}

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
        return buildCollection(name)
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
