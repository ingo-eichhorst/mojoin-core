const Koa = require('koa')
const app = (module.exports = new Koa())
const Mojoin = require('../lib/index.js')
const fs = require('fs')

const path = require('path')
const todos = JSON.parse(
  fs.readFileSync(path.join(__dirname, './datasource/todos.json'), 'utf8')
)

/**
 * Simple Webserver
 */
app.use(async function (ctx) {
  const filteredTodos = todos.filter(todo => {
    return todo.updatedAt > ctx.query.updatedAfter || '0'
  })
  const offset = Number(ctx.query.offset)
  const limit = Number(ctx.query.limit)
  const todoSlice = filteredTodos.slice(offset, limit + offset)
  ctx.body = todoSlice
})

app.listen(12987)

/**
 * Mojoin datasource from webserver
 */

const mojoin = new Mojoin([
  {
    name: 'todos',
    type: 'rest',
    location: 'http://localhost:12987/todos',
    modifiedParam: 'updatedAfter',
    modifiedField: 'updatedAt',
    paginationPageSize: 42, // optional - defaults to 100
    paginationLimitParam: 'limit', // optional - defaults to 'timit'
    paginationOffsetParam: 'offset', // optional - defaults to 'offset'
    paginationPlacement: 'query' // required - query or header - defaults to no pagination
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
  .then(() => mojoin.generateReport(query))
  .then(r => console.log(r))
  .catch(e => console.error(e))
