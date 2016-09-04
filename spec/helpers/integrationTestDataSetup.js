const app = require("../../app");
const cassandra = require('cassandra-driver');

//start server before any integration test runs
beforeAll(function (done) {
  //cassandra db data setup
  setupData(done);
  app.start();
});

//stop server after all integration tests are done
afterAll(function () {
  app.stop();
});

function setupData(done) {
  console.log('**** setting up data in cassandra ****')
  var client = new cassandra.Client({ contactPoints: ['127.0.0.1'] });
  var queryCreateKeyspace = 'CREATE KEYSPACE IF NOT EXISTS tourney WITH replication = {\'class\': \'SimpleStrategy\', \'replication_factor\' : 3}';
  client.execute(queryCreateKeyspace, function (err, result) {
    if (err) {
      console.log('Error during data setup: ' + err);
    } else {
      var queryUseKeyspace = 'USE tourney';
      client.execute(queryUseKeyspace, function (err, result) {
        if (err) {
          console.log('Error during data setup: ' + err);
        } else {
          var queryCreateTable = 'CREATE TABLE IF NOT EXISTS users (name text PRIMARY KEY, password text, house text)';
          client.execute(queryCreateTable, function (err, result) {
            if (err) {
              console.log('Error during data setup: ' + err);
            } else {
              var queryInsertJonUser = 'INSERT INTO users (name,password,house) VALUES (\'jon\',\'I know nothing\', \'stark\')';
              var queryInsertTyrionUser = 'INSERT INTO users (name,password,house) VALUES (\'tyrion\',\'I know things\', \'lannister\')';
              var queryInsertDanyUser = 'INSERT INTO users (name,password,house) VALUES (\'dany\',\'Mother of dragons\', \'targaryen\')';
              var queries = [{query: queryInsertJonUser}, {query: queryInsertTyrionUser}, {query: queryInsertDanyUser}]
              client.batch(queries, { prepare: true }, function (err) {
                if (err) {
                  console.log('Error during data setup: ' + err);
                } else {
                  console.log('**** done setting up data in cassandra *****');
                  done();
                }
              });
            }
          });
        }
      });
    }
  });
}

// function setupData() {
//   console.log('**** setting up data in cassandra ****')
//   var client = new cassandra.Client({ contactPoints: ['127.0.0.1']});
//   var source = 'SOURCE \'testData.cql\'';
//   client.execute(source, function(err, result){
//     if(err) {
//       console.log("Error during data setup: " + err);
//     }
//   });
// }  