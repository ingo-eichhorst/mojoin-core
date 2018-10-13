const Koa = require('koa')
const app = (module.exports = new Koa())
const Mojoin = require('../lib/index.js')

const path = require('path')
const todos = path.join(__dirname, './datasource/todos.json')

/**
 * Simple Webserver
 */
app.use(async function (ctx) {
  ctx.body = todos.slice(ctx.query.offset, ctx.query.limit)
})

app.listen(12987)

/**
 * Mojoin datasource from webserver
 */

const mojoin = new Mojoin([
  {
    name: 'todos',
    type: 'rest',
    location: 'https://localhost:12987/todos',
    pagination: {
      pageSize: 2, // defaults to 20
      limitParam: 'limit', // needed for html
      offsetParam: 'offset', // needed for html
      placement: 'query' // needed for html
    }
  }
])

const query = {
  table: 'users',
  where: {
    userId: 2
  }
}

mojoin
  .syncAll()
  .then(() => mojoin.generateReport(query))
  .then(r => console.log(r))
  .catch(e => console.error(e))
