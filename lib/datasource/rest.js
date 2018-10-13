'use strict'

const axios = require('axios')
const debug = require('debug')('mojoin:REST')

const Datasource = require('./datasource')

// TODO: validate every datasource type seperately in the inherent class on initialization

/**
 * REST resource - Datasource
 */
class REST extends Datasource {
  /**
   * queries a mongodb datasource
   *
   * @param {object} options
   * @param {number} options.limit
   * @param {number} options.offset
   * @param {date} options.modifiedAfter
   * @returns {array} docs - query result as js array
   */
  async queryDatasource ({modifiedAfter, limit, offset} = {}) {
    // TODO: specify the rest options when initializing a rest datasource
    const options = {
      params: {},
      headers: {}
    }

    if (this.pagination) {
      if (this.pagination.place === 'query') {
        options.params[this.limitField] = limit
        options.params[this.offsetField] = offset
      } else if (this.pagination.place === 'header') {
        options.headers[this.limitField] = limit
        options.headers[this.offsetField] = offset
      }
    }

    try {
      const response = await axios.get(this.location, options)
      return response.data
    } catch (e) {
      debug('Error fetching REST resource %s: %s', this.location, e.message)
    }
  }
}

module.exports = REST
