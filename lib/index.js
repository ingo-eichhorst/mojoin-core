'use strict'

const path = require('path')

const Datasource = require('./datasource')
const Cache = require('./cache')
const Report = require('./report')

/**
 * Sync all kinds of datasources into a central SQL database
 * and perform queries/ joins on the gathered data
 */
class Mojoin {
  /**
   * Mojoin constructor
   *
   * @constructor
   * @param {object | array} config | datasources
   * @param {array} config.datasources - array of datasource objects
   * @param {object} config.cache - cache config object
   */
  constructor (config) {
    // TODO: input validation
    let datasourceConfigs
    if (Array.isArray(config)) datasourceConfigs = config
    else datasourceConfigs = config.datasources

    const cacheConfig = config.cache || {
      type: 'sqlite',
      location: path.join(__dirname, '../db/cache.db')
    }
    this.cache = new Cache(cacheConfig)

    this.datasources = []
    datasourceConfigs.forEach(config => this.addDatasource(config))
  }

  /**
   * adds a datasource to the Mojoion instance
   *
   * @param {object} datasource
   * @param {string} datasource.type
   * @param {string} datasource.location
   */
  addDatasource (datasource) {
    datasource.cache = this.cache
    const newDatasource = Datasource(datasource)
    try {
      newDatasource.validate()
    } catch (e) {
      e.message = 'Datasource input is not valid: ' + e.message
      throw e
    }
    this.datasources.push(newDatasource)
    return datasource
  }

  /**
   * syncronizes all datasources with the cache
   *
   * @returns {object} - syncResults
   */
  async syncAll () {
    let syncResults = []
    for (let i = 0; i < this.datasources.length; i++) {
      await this.datasources[i].init()
      const result = await this.datasources[i].syncDatasource()
      syncResults.push(result)
    }
    return syncResults
  }

  /**
   * queries the cache and returns the result
   *
   * @param {object} query - query object (see README.md for specification)
   * @returns {object} report
   */
  async generateReport (query) {
    const report = new Report({ cache: this.cache, query })
    try {
      report.validate()
    } catch (e) {
      e.message = `Report input validation error: ${e.message}`
      throw e
    }
    const result = await report.generate()
    return result
  }
}

module.exports = Mojoin
