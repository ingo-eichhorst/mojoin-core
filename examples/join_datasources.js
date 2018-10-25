const path = require('path')

const Mojoin = require('../lib/index.js')
const mojoin = new Mojoin([
  {
    name: 'todos',
    type: 'json',
    location: path.join(__dirname, './datasource/todos.json')
  },
  {
    name: 'users',
    type: 'rest',
    location: 'https://jsonplaceholder.typicode.com/users'
  }
])

const query = {
  table: 'todos',
  where: {
    userId: 2,
    completed: 0
  },
  include: [
    {
      model: 'users',
      foreignKey: 'userId'
    }
  ]
}

mojoin
  // .syncAll()
  // .then(() => mojoin
  .generateReport(query)
  // )
  .then(r => console.log(r))
  .catch(e => console.error(e))
