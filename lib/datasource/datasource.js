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
   */
  constructor ({ name, type, cache, location, idField, privateSshKey }) {
    validate({ name, type, cache, location })
    this.cache = cache
    this.name = name
    this.type = type
    this.location = location
    this.privateSshKey = privateSshKey
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
    const data = await this.queryDatasource()
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
   * Queries the datasource and saves the current state in the cache
   *
   * @param {object} TODO: specify
   * @returns {object} syncResult
   */
  async syncDatasource ({ modified, limit } = {}) {
    const started = new Date()

    const Table = await this.cache.upsertTable(
      this.name,
      this.schema,
      this.idField
    )

    // TODO: handle partial sync if modified field is defined
    if (modified) {
    }

    let resultLength = 0
    let offset = 0
    const result = []
    do {
      debug('syncing %s entries %s to %s', this.name, offset, ((offset + 1) * limit) || 'all')
      const page = await this.queryDatasource({ limit, offset })
      result.push(...page)
      await this.cache.upsertRows({
        idField: this.idField,
        rows: result,
        Table
      })
      resultLength = limit ? result.length : 0
      offset++
    } while (resultLength > 0)

    const finished = new Date()
    debug('finished syncing %s in %d seconds', this.name, (finished - started) / 1000)
    return {
      started,
      finished,
      syncedEntities: result.length
    }
  }
}

module.exports = Datasource
