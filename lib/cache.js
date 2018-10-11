'use strict'

const Sequelize = require('sequelize')
const Sequelizer = require('sequelizer')
const mkdirp = require('mkdirp')

/**
 * Cache to save remote datasets in one central
 * space that can be queried easily
 */
class Cache {
  /**
   * Cache constructor
   *
   * @constructor
   * @param {object} config.type - 'mysql'|'sqlite'|'postgres'|'mssql'
   *                 config.location - url or path to databse
   *                 config.username - login credentials
   *                 config.password - login credentials
   */
  constructor (config) {
    // TODO: validate config
    this.databaseName = 'mojoin-cache'
    this.initSequelize(config)
    this.type = config.type
    this.location = config.location
    this.tables = {}
  }

  /**
   * builds an instance of sequalize as cache database
   *
   * @param {object} config.type - 'mysql'|'sqlite'|'postgres'|'mssql'
   *                 config.location - url or path to databse
   *                 config.username - login credentials
   *                 config.password - login credentials
   */
  initSequelize (config) {
    const sequelizeOptions = {
      host: config.type === 'sqlite' ? null : config.location,
      dialect: config.type,
      pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
      },
      storage: config.type === 'sqlite' ? config.location : null,
      operatorsAliases: false,
      logging: false
    }

    this.sequelize = new Sequelize(
      'mojoin-cache',
      config.username,
      config.password,
      sequelizeOptions
    )

    if (sequelizeOptions.storage) {
      const string = sequelizeOptions.storage
      mkdirp.sync(string.substring(0, string.lastIndexOf('/')))
    }

    console.log('... Initialized Cache')
  }

  /**
   * test if the cache connection works
   *
   * @returns testResult
   */
  async test () {
    try {
      await this.sequelize.authenticate()
      return { connected: true }
    } catch (e) {
      return { connected: false, error: e }
    }
  }

  /**
   * transforms a Mojoin query into a sequelize query
   *
   * @param {string} table - name of the base table
   * @param {object} sourceQuery - Mojoin query
   * @returns {object} sequalizeQuery - query that can be used with findAll() from Sequelize
   */
  transformToSequelizeQuery (sourceQuery) {
    const query = JSON.parse(JSON.stringify(sourceQuery))
    if (query.include) {
      query.include = query.include.map(include => {
        this.tables[query.table].belongsTo(this.tables[include.model], {
          foreignKey: include.foreignKey
        })
        return {
          model: this.tables[include.model],
          required: include.required
        }
      })
    }
    return query
  }

  /**
   * builds and sends a SELECT request to the specified table of the cache database
   *
   * @param {object} query - Mojoin style query - see README.md for reference
   * @returns {array} queryResult - result of the SELECT query
   */
  async query (query) {
    await this.sequelize.sync()
    const sequalizeQuery = this.transformToSequelizeQuery(query)
    const result = await this.tables[query.table].findAll(sequalizeQuery)
    const plainResult = result.map(entry => entry.get({ plain: true }))
    return plainResult
  }

  /**
   * inserts a table into the cache if it doesn't exists
   *
   * @param {string} name - name and id of the table
   * @param {object} schema - json schema definition of datasource
   * @param {string} idField - field that holds the primary and unique key
   * @returns {object} instantiated Table
   */
  async upsertTable (name, schema, idField) {
    schema.id = 'http://api.example.com/v1/schemas/user'
    const sequelizeSchema = Sequelizer.fromJsonSchema(schema)
    if (idField) {
      sequelizeSchema[idField] = sequelizeSchema[idField] || {}
      sequelizeSchema[idField].primaryKey = true
      sequelizeSchema[idField].unique = true
    }
    // TODO: Handle Upsert correctly - if exists update schema
    if (!this.tables[name]) {
      this.tables[name] = await this.sequelize.define(name, sequelizeSchema)
    }
    return this.tables[name]
  }

  /**
   * Inserts or updates (depending on a matching id) a list of rows in a table
   *
   * @param {object} options.row - rows data
   * @param {object} options.Table - sequalize table object
   * @returns {object} Promise - resolves with all updated promises or rejects with error
   */
  async upsertRows ({ rows, Table }) {
    // TODO: change input from Table object to Table name and get the Table object from the object itself
    const promises = rows.map(row => {
      return this.sequelize
        .sync()
        .then(() => Table.findById(row.id))
        .then(id => {
          if (!id) {
            return Table.create(row)
          } else if (id.dataValues.name !== row.name) {
            return Table.update(row, { where: { id: row.id } })
          } else return true
        })
        .catch(e => console.error(e))
    })

    return Promise.all(promises)
  }
}

module.exports = Cache
