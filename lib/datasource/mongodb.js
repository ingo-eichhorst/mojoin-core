'use strict'

const Datasource = require('./datasource')
const MongoClient = require('mongodb').MongoClient
const { promisify } = require('util')
const Nodessh = require('node-ssh')
const ssh = new Nodessh()
const ejson = require('ejson')
const urlParser = require('url')

/**
 * MongoDb - Datasource
 */
class MongoDb extends Datasource {
  /**
   * queries a mongodb datasource via the mongodb protocol
   *
   * @returns {array} docs - query result as js array
   */
  async queryOverMongodb () {
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

  /**
   * queries a mongodb datasource via the ssh protocol
   *
   * @returns {array} docs - query result as js array
   */
  async queryOverSsh () {
    const connectionData = this.location.match(/(.*)\/(.*)\/(.*)$/)
    const url = connectionData[1]
    const dbName = connectionData[2]
    const collection = connectionData[3]
    const offset = null
    const limit = null
    const urlObject = urlParser.parse(this.location)
    const projection = {}
    const query = {}
    const sortString = ''

    let sshConnectOptions = {
      host: urlObject.host,
      username: 'deploy',
      // password: 'vagrant'
      privateKey: '/Users/ingo/.ssh/ieichhorst_rsa'
    }

    let limitString = ''
    if (offset) limitString = '.limit(' + limit + ').skip(' + offset + ')'

    // TODO: mongoDb lib supports promises out of the box: change to that behaviour
    let mongoCommand = "mongo --quiet '" + dbName + "' --eval " +
      "'JSON.stringify(db." + collection + '.find(' +
      ejson.stringify(query) + ',' + ejson.stringify(projection) +
      ')' + sortString + limitString +
      ".toArray())'"

    console.log(mongoCommand)

    const sshConnection = await ssh.connect(sshConnectOptions)
    console.log(sshConnection)

    const result = await ssh.execCommand(mongoCommand)
    console.log(result.lenght)

    if (result.stderr) return result.stderr
    console.log(result.stdout)
    return result.stdout
  }

  /**
   * queries a mongodb datasource
   *
   * @returns {array} docs - query result as js array
   */
  async queryDatasource () {
    let docs
    if (this.location.startsWith('mongodb://')) docs = await this.queryOverMongodb()
    else if (this.location.startsWith('ssh://')) docs = await this.queryOverSsh()
    return docs
  }
}

module.exports = MongoDb
