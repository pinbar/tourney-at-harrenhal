var logger = require("./logger");
var cassandra = require('cassandra-driver');

var client = new cassandra.Client({ contactPoints: ['127.0.0.1'], keyspace: 'tourney' });

module.exports = {
    getUsers: function (callback) {
        const query = 'SELECT * FROM users';
        client.execute(query, function (err, result) {
            callback(err, result.rows);
        });
    }
}