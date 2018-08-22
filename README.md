# MoJoin Core

```Javascript
  import { Cache, Report, REST, MongoDb, SQL, JSON } from 'mojoin'

  const cache = new Cache({
    type: 'SQLite'
    location: './db'
  })

  const query // sequelize query
  const report = new Report(cache, query)
  await report.export({
    type: 'xls'
  })

```

## Cache

### Default

### Specified

  type: 'postgres' // 'mysql'|'sqlite'|'postgres'|'mssql'