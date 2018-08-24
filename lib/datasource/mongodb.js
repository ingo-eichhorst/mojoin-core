const Datasource = require('./datasource')
const MongoClient = require('mongodb').MongoClient
const { promisify } = require('util')

/**
 * MongoDb - Datasource
 */
class MongoDb extends Datasource {
  /**
   * queries a mongodb datasource
   *
   * @returns {array} docs - query result as js array
   */
  async queryDatasource () {
    const connectionData = this.location.match(/(.*)\/(.*)\/(.*)$/)
    const url = connectionData[1]
    const dbName = connectionData[2]
    const collectionName = connectionData[3]

    // TODO: mongoDb lib supports promises out of the box: change to that behaviour
    const promisifiedConnect = promisify(MongoClient.connect)
    const client = await promisifiedConnect(url)
    const db = client.db(dbName)
    const collection = db.collection(collectionName)

    const docs = await collection.find().toArray()

    client.close()
    return docs
  }
}

module.exports = MongoDb
