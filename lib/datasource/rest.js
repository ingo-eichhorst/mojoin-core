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
   * Queries a REST datasource
   *
   * @param {object} options
   * @param {date} options.modifiedAfter
   * @param {number} options.offset
   * @returns {array} docs - query result as js array
   */
  async queryDatasource ({ modifiedAfter, offset } = {}) {
    // TODO: specify the rest options when initializing a rest datasource
    const options = {
      params: {},
      headers: {}
    }

    if (this.paginationPlacement) {
      let place = {}
      if (this.paginationPlacement === 'query') place = options.params
      else if (this.paginationPlacement === 'header') place = options.headers
      else {
        throw new Error(
          'Error: Specified paginationPlacement is not supported: use query or header'
        )
      }
      place[this.paginationLimitParam] = this.paginationPageSize
      place[this.paginationOffsetParam] = offset
    }

    try {
      const response = await axios.get(this.location, options)
      return response.data
    } catch (e) {
      debug('Error fetching REST resource %s: %s', this.location, e.message)
      throw e
    }
  }
}

module.exports = REST
