# MoJoin Core [![npm version](https://badge.fury.io/js/mojoin-core.svg)](https://badge.fury.io/js/mojoin-core)

[![CircleCI](https://circleci.com/gh/ingo-eichhorst/mojoin-core.svg?style=shield)](https://circleci.com/gh/ingo-eichhorst/mojoin-core) [![Coverage Status](https://coveralls.io/repos/github/ingo-eichhorst/mojoin-core/badge.svg?branch=master)](https://coveralls.io/github/ingo-eichhorst/mojoin-core?branch=master) [![Codacy Badge](https://api.codacy.com/project/badge/Grade/c46eb5d869004060bd33ccc8e4d137e2)](https://app.codacy.com/app/ingo-eichhorst/mojoin-core?utm_source=github.com&utm_medium=referral&utm_content=ingo-eichhorst/mojoin-core&utm_campaign=badger) [![Maintainability](https://api.codeclimate.com/v1/badges/2873d7c6e04b0f3524c2/maintainability)](https://codeclimate.com/github/ingo-eichhorst/mojoin-core/maintainability) [![Known Vulnerabilities](https://snyk.io/test/github/ingo-eichhorst/mojoin-core/badge.svg)](https://snyk.io/test/github/ingo-eichhorst/mojoin-core) [![JavaScript Style Guide: StandardJS](https://img.shields.io/badge/code%20style-StandardJS-brightgreen.svg?style=flat)](https://github.com/dwyl/goodparts "JavaScript The Good Parts") [![License: MIT](https://img.shields.io/badge/license-MIT-brightgreen.svg?style=flat)](https://en.wikipedia.org/wiki/MIT_License) 

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
