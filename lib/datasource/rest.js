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
   * @param {date} options.modifiedAfter
   * @param {number} options.offset
   * @returns {array} docs - query result as js array
   */
  async queryDatasource ({modifiedAfter, offset} = {}) {
    // TODO: specify the rest options when initializing a rest datasource
    const options = {
      params: {},
      headers: {}
    }

    if (this.paginationPlacement === 'query') {
      options.params[this.paginationLimitParam] = this.paginationPageSize
      options.params[this.paginationOffsetParam] = offset
    } else if (this.paginationPlacement === 'header') {
      options.headers[this.paginationLimitParam] = this.paginationPageSize
      options.headers[this.paginationOffsetParam] = offset
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
