/**
 * Cache to save remote datasets in one central
 * space that can be queried much mor easily
 */

const Sequelize = require('sequelize')
const Sequelizer = require('sequelizer')
const mkdirp = require('mkdirp')

class Cache {
  constructor (config) {
    // TODO: validate config
    this.databaseName = 'mojoin-cache'
    this.init(config)
    this.type = config.type
    this.location = config.location
    this.tables = {}
  }

  init (config) {
    // TODO: upsert sqlite file if not exists
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
      config.CACHE_USERNAME,
      config.CACHE_PASSWORD,
      sequelizeOptions
    )

    if (sequelizeOptions.storage) {
      const string = sequelizeOptions.storage
      mkdirp.sync(string.substring(0, string.lastIndexOf('/')))
    }

    console.log('... Initialized Cache')
  }

  async test () {
    const testResult = await this.sequelize.authenticate()
    return testResult
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
    query.include = query.include.map(include => {
      this.tables[query.table].belongsTo(this.tables[include.model], {foreignKey: include.foreignKey})
      return {
        model: this.tables[include.model],
        required: include.required
      }
    })
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
    // transform mojoin query to sequalize query
    const sequalizeQuery = this.transformToSequelizeQuery(query)
    const result = await this.tables[query.table].findAll(sequalizeQuery)
    const plainResult = result.map((entry) => entry.get({ plain: true }))
    return plainResult
  }

  async upsertTable (name, schema, idField) {
    schema.id = 'http://api.example.com/v1/schemas/user'
    const sequelizeSchema = Sequelizer.fromJsonSchema(schema)
    if (idField) {
      sequelizeSchema[idField].primaryKey = true
      sequelizeSchema[idField].unique = true
    }
    // TODO: Handle Upsert correctly - if exists update schema
    if (!this.tables[name]) this.tables[name] = await this.sequelize.define(name, sequelizeSchema)
    return this.tables[name]
  }

  async upsertRows ({rows, Table}) {
    const promises = rows.map(row => {
      return this.sequelize.sync()
        .then(() => Table.findById(row.id))
        .then((id) => {
          if (!id) {
            return Table.create(row)
          } else if (id.dataValues.name !== row.name) {
            return Table.update(row, {where: {id: row.id}})
          } else return true
        })
        .catch(e => console.error(e))
    })

    return Promise.all(promises)
  }
}

module.exports = Cache
