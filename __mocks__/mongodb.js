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
    find ({ modifiedAt }) {
      this.result = JSON.parse(JSON.stringify(albums))

      if (modifiedAt && modifiedAt.$gt) {
        this.result = this.result.filter(entry => {
          return new Date(entry.modifiedAt) > modifiedAt.$gt
        })
      }

      return this
    },
    /**
     * Mock toArray
     */
    toArray () {
      const offset = this.offset ? this.offset : 0
      const limit = this.limit ? this.limit : this.result.length
      return this.result.slice(offset, limit + offset)
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
