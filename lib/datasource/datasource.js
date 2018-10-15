'use strict'

// const schedule = require('node-schedule')
const GenerateSchema = require('generate-schema')
const validate = require('./datasource.validate')
const debug = require('debug')('mojoin:Datasource')

// TODO: Test if the datasource can be reached

/**
 * Base Datasource - contains all the methods that can be joiently used by
 * the specialized Datasources
 */
class Datasource {
  /**
   * Datasource constructor
   *
   * @constructor
   * @param {string} options
   * @param {string} options.name - name of the datasource
   * @param {string} options.type
   * @param {object} options.cache
   * @param {string} options.location
   * @param {string} options.idField
   * @param {string} options.privateSshKey
   * @param {string} options.paginationPageSize
   * @param {string} options.paginationLimitParam
   * @param {string} options.paginationOffsetParam
   * @param {string} options.paginationPlacement
   */
  constructor ({
    name,
    type,
    cache,
    location,
    idField,
    privateSshKey,
    paginationPageSize,
    paginationLimitParam,
    paginationOffsetParam,
    paginationPlacement
  }) {
    validate({ name, type, cache, location })
    this.cache = cache
    this.name = name
    this.type = type
    this.location = location

    this.privateSshKey = privateSshKey

    this.paginationPageSize = this.type !== 'json' ? paginationPageSize || 100 : null
    this.paginationLimitParam = paginationLimitParam || 'limit'
    this.paginationOffsetParam = paginationOffsetParam || 'offset'
    this.paginationPlacement = paginationPlacement
    // TODO: improve id field gatrhering on init() whidth the gathered schema
    this.idField = idField || 'id'
    this.lastStatusUpdate = new Date()
  }

  /**
   * initializes the datasource by performing setup tasks
   *
   * @returns instanziated Datasource
   */
  async init () {
    this.schema = await this.autoGenerateSchema()
    return this
  }

  /**
   * automatically generates a json schema based on the remotes datasource data
   * (this may take a while and will be skipped if already available)
   *
   * @returns {object} jsonSchema
   */
  async autoGenerateSchema () {
    const data = await this.queryDatasource({ offset: 0 })
    const allFieldsExample = data.reduce((agg, curr) => {
      return Object.assign(agg, curr)
    }, {})
    const schema = GenerateSchema.json(this.name, allFieldsExample)
    debug('auto-generated shema for %s datasource: %s', this.type, this.name)
    return schema
  }

  /**
   * Queries a datasource
   */
  async queryDatasource () {
    throw new Error('Query datasource not implemented for: ' + this.type)
  }

  /**
   * syncing a slice (offset + paginationPageSize) of the datasource
   *
   * @param {object} options
   * @param {date} modifiedAfter
   * @param {number} offset
   * @param {object} Table - Sequalize table object
   * @returns {array} page - synced entries of the current page
   */
  async syncSliceOfDatasource ({modifiedAfter, offset, Table}) {
    debug(
      'syncing %s - %s to %s',
      this.name,
      offset,
      offset + this.paginationPageSize || 'all'
    )
    try {
      const page = await this.queryDatasource({
        modifiedAfter,
        offset
      })
      await this.cache.upsertRows({
        idField: this.idField,
        rows: page,
        Table
      })
      return page
    } catch (e) {
      debug('Error syncing datasource: %s', e.message)
      throw e
    }
  }

  /**
   * Creates or updates a table in the the cache
   *
   * @returns {object} Table - sequalize table object
   */
  async upsertTableInCache () {
    return this.cache.upsertTable(
      this.name,
      this.schema,
      this.idField
    )
  }

  /**
   * Queries the datasource and saves the current state in the cache
   *
   * @param {object} options
   * @param {date} options.completeSync - sync everything - default: everything after last modified date
   * @returns {object} syncResult
   */
  async syncDatasource ({ completeSync } = {}) {
    const started = new Date()
    const Table = await this.upsertTableInCache()

    let resultLength = 0
    let offset = 0
    const result = []
    do {
      const page = await this.syncSliceOfDatasource({modifiedAfter, offset, Table})
      result.push(...page)
      resultLength = this.paginationPageSize ? page.length : 0
      offset += this.paginationPageSize
    } while (resultLength >= this.paginationPageSize && this.type !== 'json')

    const finished = new Date()
    debug(
      'finished syncing %d %s in %d seconds',
      result.length,
      this.name,
      (finished - started) / 1000
    )
    return {
      started,
      finished,
      syncedEntities: result.length
    }
  }
}

module.exports = Datasource
