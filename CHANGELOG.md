# Changelog

## Roadmap

- [ ] Encrypt cache
- [ ] Multi-Tenancy
- [ ] Rewrite in typescript
- [ ] Benchmark tests
- [ ] Time-Series Reports
- [ ] Security: Detect SQL injection attacts and prevent
- [ ] Datasource Support SQL databases with (sequalize)
- [ ] Initializing the cache includes synchronous creation of folder if not exists --> this should be asynchronous
- [ ] Threading for long running/ blocking worker processes e.g. Treat syncing processes as task with a certain progress
- [ ] Make horizontal scaling possible by external queue

## Version 0.1.0 - 2018-xx-xx

- [ ] Resolve all the CodeClimate issues
- [ ] Resolve all the TODOs in the code
- [ ] Improve the jsdoc comments so that a jsdoc wesite report looks good
- [ ] Improve readme with complete documentation
- [ ] CodeImprovement: all functions take only a object as input
- [ ] Clean up tests
- [x] ~~implement recurring sync~~ (moved to the mojoin server, since it's only needed there)
- [ ] insert git repository in pacage json

- Error handling for:
  - [ ] idField does not exist

## Version 0.0.7 - 2018-xx-xx

- [ ] Input validation for all methods/ functions
- [ ] Sync all included datasources before query by default
- [ ] Only update changed data in the cache (by modification date)

## Version 0.0.6 - 2018-10-15

- [x] Datasource query pagination
- [X] Logging library debug
- [x] Insert projects logo in the readme

## Version 0.0.5 - 2018-10-11

- [x] ~~Export Reports as CSV, JSON or XLS~~ (this is moved to the desktop and server app)
- [x] Improve error handling
- [x] MongoDB connection via ssh
- [x] Add >90% unit and integration tests
- [x] Use Strict everywhere

## Version 0.0.4 - 2018-08-24

- [x] JSDocs
- [x] Builds on PR - CiercleCi
- [x] Code Quality checks - codacy
- [x] Vulnarability checks - snyk

## Version 0.0.3 - 2018-08-23

- [x] Disable verbose logging
- [x] Added unit test structure
- [x] Simplified query structure

## Version 0.0.2 - 2018-08-22

- [x] Automatically create cache db and folder if not exists

## Version 0.0.1 - 2018-08-22

- [x] Caching of datasources
- [x] Query and perform joins on cached data
- [x] Datasource configuration
- [x] Multiple supported datasources
  - [x] MongoDB
  - [x] REST API
  - [x] Json File
- [x] Automatically generate schema based on a dataset
- [x] Example
- [x] Readme

Mojoin-Server

- [ ] e2e Tests
- [ ] Implement recurring sync
- [ ] Export Reports as CSV, JSON or XLS
- [ ] Nest.js framework
- [ ] Bootstrap phase to ramp up all dependencies or throw errors
- [ ] Save datasources, queries and generated reports in database
- [ ] Simple UI (for datasource, queries, ...) in VueJS
- [ ] Simple User Management
- [ ] DotEnv for configuration
- [ ] Dockerize

Mojoin-Desktop

- [ ] e2e Tests
- [ ] Export Reports as CSV, JSON or XLS
- [ ] Electron App that implements Mojoin-Core
