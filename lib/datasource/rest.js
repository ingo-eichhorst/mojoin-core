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
   * add pagination to the axios options
   *
   * @param {object} options
   * @param {object} options.axiosOptions
   * @param {number} options.offset
   * @returns {object} enrichedOptions
   */
  addPaginationToAxiosOptions ({options, offset}) {
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
    return options
  }

  /**
   * Generate options for the axios Request
   *
   * @param {object} options
   * @param {date} options.modifiedAfter
   * @param {number} options.offset
   */
  buildAxiosOptions ({ modifiedAfter, offset }) {
    let options = {
      params: {},
      headers: {}
    }

    options = this.addPaginationToAxiosOptions({options, offset})

    if (this.modifiedParam) options.params[this.modifiedParam] = modifiedAfter ? modifiedAfter.toISOString() : null

    return options
  }

  /**
   * Transforms all date strings inside an array of objects as js dates
   *
   * @param {array} array
   * @returns {array} transformedArray
   */
  parseDateStringsInObjectArray (array) {
    // TODO: this only woorks for the top level of an object!
    return array.map(entry => {
      for (const prop in entry) {
        if (typeof entry[prop] === 'string') {
          const convertedDate = new Date(entry[prop])
          if (convertedDate && convertedDate.toString() !== 'Invalid Date') entry[prop] = convertedDate
        }
      }
      return entry
    })
  }

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

    try {
      const response = await axios.get(
        this.location,
        this.buildAxiosOptions({ modifiedAfter, offset })
      )

      const resonseObject = this.parseDateStringsInObjectArray(response.data)
      return resonseObject
    } catch (e) {
      debug('Error fetching REST resource %s: %s', this.location, e.message)
      throw e
    }
  }
}

module.exports = REST
