# MoJoin Core

## Quick Start

```Javascript
const Mojoin = require('mojoin-core')
const mojoin = new Mojoin([
  {
    name: 'todos',
    type: 'json',
    location: './node_modules/mojoin-core/examples/datasource/todos.json'
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
  include: [{
    model: 'users',
    foreignKey: 'userId'
  }]
}

mojoin.syncAll()
  .then(() => mojoin.generateReport(query))
  .then(r => console.log(r))
  .catch(e => console.error(e))
```

## Cache

### Default

### Specified

  type: 'postgres' // 'mysql'|'sqlite'|'postgres'|'mssql',