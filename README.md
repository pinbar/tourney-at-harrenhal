## A tournament bracket app built with NodeJS(express), AngularJS 2 and Cassandra
The project name is an homage to the tournament that set in motion the events of Game of Thrones (http://awoiaf.westeros.org/index.php/Tourney_at_Harrenhal)

[![CircleCI](https://img.shields.io/circleci/project/pinbar/tourney-at-harrenhal/master.svg)](https://circleci.com/gh/pinbar/tourney-at-harrenhal) [![Test Coverage](https://codeclimate.com/github/pinbar/tourney-at-harrenhal/badges/coverage.svg)](https://codeclimate.com/github/pinbar/tourney-at-harrenhal/coverage) [![Code Climate](https://codeclimate.com/github/pinbar/tourney-at-harrenhal/badges/gpa.svg)](https://codeclimate.com/github/pinbar/tourney-at-harrenhal) [![Issue Count](https://codeclimate.com/github/pinbar/tourney-at-harrenhal/badges/issue_count.svg)](https://codeclimate.com/github/pinbar/tourney-at-harrenhal)

### tech stack
* **nodejs** - javascript runtime built on v8 engine
* **express** - minimalistic web api framework for nodejs
* **cassandra** - a non-relational database that has high availability and linear scalability
* **cassandra-driver** - for connecting to cassandra
* **body-parser** - middleware for body parsing
* **winston** - async logger for nodejs
* **morgan** - middleware for http request/response logging
* **jsonwebtoken** - jwt implementation for nodejs
* **crypto** - cryptography module for nodejs
* **jasmine** - testing framework
* **jasmine-reporters** - test result reporters (using JUnit reporter for CircleCI)
* **istanbul** - module for test instrumentation and coverage
* **request** - module for testing end-points
* **artillery** - load testing framework for nodejs

### prerequisites
* Node and NPM (verify with `node -v` and `npm -v`)
* Apache Cassandra
    * cassandra depends on java8 (verify with `java --version`)

### getting started
* clone repo and `npm install`
* set up database
    * start cassandra
    * create keyspace, table and data (see `/spec/helpers/testData.cql` for reference)
* in the project directory, run `node index.js`
* launch the browser and point to `localhost:8081` (port can be changed in `config.js`)
* *optional:*
    * use **pm2** to manage your node app (if you don't have pm2, install it globally `npm install -g pm2`)
    * it can monitor for changes in your nodejs app and automatically restart the server (`pm2 start index.js --watch`)
    * it can also run the app in cluster mode (`pm2 index.js -i max`)
    * https://github.com/Unitech/pm2

### running tests
* tests are in the `spec` directory
* `integration` tests automatically setup data and start the server before making api calls
* to run all the tests, run `npm test` in the project directory
* to run a single test, mark it with `fit` (use `fdescribe` to include the entire spec)
* to exclude a test, mark it with `xit` (use `xdescribe` to exclude the entire spec)
* **test coverage:** 
    * to run instrumented code and generate coverage reports, run `npm run test-with-coverage`
    * coverage reports are in `reports/coverage` directory (can be configured in `.istanbul.yml`)
* **reporter** runs a jasmine helper to produce JUnit formatted test results in `reports/junit`
* **load test** run artillery load tests:
    * ensure that the server is running (`node index.js`)
    * run the load test and generate report `npm run test-load-run && npm run test-load-report`

### api and authentication scenarios
* all `/api/*` calls are secured with JWT authentication
* obtain a JWT token here `POST /authenticate.html`
    * enter name:password (example: jon:I know nothing)
    * the response contains a JWT token for that user
* use the token when calling any secure api (`/api/*`):
    * set the `Authorization` request header and add the jwt token, like so:
    * `Authorization: Bearer \<token\>`
* `GET /api/castleblack` can be accessed with any token but `GET /api/winterfell` can only be accessed with house stark's token
* some information in the payload is encrypted for privacy

### encryption
* a part of the jwt claims/playload is encrypted before signing and then decrypted after verification for privacy
* this is different from JWE, where only the signature is encrypted while the claims/payload can be easily decoded and read