const Datasource = require('./datasource')
const axios = require('axios')

class REST extends Datasource {
  async queryDatasource () {
    const options = {
      params: {
        ID: 12345
      }
    }

    const response = await axios.get(this.location, options)

    return response.data
  }
}

module.exports = REST
