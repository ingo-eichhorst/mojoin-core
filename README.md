# MoJoin Core

[![Codacy Badge](https://api.codacy.com/project/badge/Grade/c46eb5d869004060bd33ccc8e4d137e2)](https://app.codacy.com/app/ingo-eichhorst/mojoin-core?utm_source=github.com&utm_medium=referral&utm_content=ingo-eichhorst/mojoin-core&utm_campaign=badger)

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
  query: {
    where: {
      userId: 2,
      completed: 0
    },
    include: [{
      model: 'users',
      foreignKey: 'userId'
    }]
  }
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