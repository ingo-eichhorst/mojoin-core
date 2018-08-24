const Datasource = require('./datasource')
const axios = require('axios')

// TODO: validate every datasource type seperately in the inherent class on initialization

/**
 * REST resource - Datasource
 */
class REST extends Datasource {
  /**
   * queries a mongodb datasource
   *
   * @returns {array} docs - query result as js array
   */
  async queryDatasource () {
    // TODO: specify the rest options when initializing a rest datasource
    const options = {
      params: {
        example: 'value'
      }
    }

    const response = await axios.get(this.location, options)

    return response.data
  }
}

module.exports = REST
