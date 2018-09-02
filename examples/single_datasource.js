const path = require('path')

const Mojoin = require('../lib/index.js')
const mojoin = new Mojoin([
  {
    name: 'todos',
    type: 'json',
    location: path.join(__dirname, './datasource/todos.json')
  }
])

const query = {
  table: 'todos',
  where: {
    userId: 2
  }
}

mojoin
  .syncAll()
  .then(result => {
    return mojoin.generateReport(query)
  })
  .then(r => console.log(r))
  .catch(e => console.error(e))
