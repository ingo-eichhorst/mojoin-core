'use strict'

// const schedule = require('node-schedule')
const GenerateSchema = require('generate-schema')
const Cache = require('../cache')
const validateScheam = require('jsonschema').validate

// TODO: Test if the datasource can be reached
// TODO: schedule for permanent updating of datasource
// TODO: support multiple transporters (e.g. for mongo)

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
   * @param {string} options.type - datasource type
   * @param {object} options.cache - cache object
   * @param {string} options.location - location url or path
   * @param {string} options.idField
   */
  constructor ({ name, type, cache, location, idField, schema }) {
    this.cache = cache
    this.name = name
    this.type = type
    this.location = location
    this.schema = schema
    // TODO: improve id field gatrhering on init() whidth the gathered schema
    this.idField = idField || 'id'
    this.lastStatusUpdate = new Date()
  }

  /**
   * check if the input for building a datasource is correct
   *
   * @param {object} options
   * @param {string} options.name - name of the datasource
   * @param {string} options.type - datasource type
   * @param {object} options.cache - cache object
   * @param {string} options.location - location url or path
   */
  validate () {
    if (!this.schema || typeof this.schema !== 'object') { throw new Error('no schema for input validation provided') }
    const validationResult = validateScheam(
      { name: this.name, type: this.type, location: this.location },
      this.schema
    )
    if (validationResult.errors.length > 0) {
      const errorString = validationResult.errors
        .reduce((agg, e) => {
          agg += `${e.stack}, `
          return agg
        }, '')
        .slice(0, -2)
      throw new Error(`Validation error: ${errorString}`)
    }
    if (
      !this.cache ||
      typeof this.cache !== 'object' ||
      !(this.cache instanceof Cache)
    ) {
      throw new Error('options.cache as instance of Cache is required')
    }
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
    const schema = GenerateSchema.json(this.name, data[0])
    return schema
  }

  // /**
  //  * TODO
  //  */
  // setRecurringSync () {
  //   // TODO: implement and use
  //   this.recurringSync = schedule.scheduleJob('*/5 * * * * *', () => {
  //     console.log('Sync:', this.name, new Date())
  //     this.syncDatasource({})
  //       .then(r => console.log(r))
  //       .catch(e => console.error(e))
  //   })
  // }

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
    console.log(`Syncing ${this.name} ...`)
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

    console.log('... sync finished')

    const finished = new Date()
    return {
      started,
      finished,
      syncedEntities: result.length
    }
  }
}

module.exports = Datasource
