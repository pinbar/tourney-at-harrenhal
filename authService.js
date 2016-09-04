const cassandra = require('cassandra-driver');
var client = new cassandra.Client({ contactPoints: ['127.0.0.1'], keyspace: 'tourney' });

module.exports = {
    authenticate: function (name, password, callback) {
        const query = 'SELECT * FROM users WHERE name=? AND password=? ALLOW FILTERING';
        var isValid = false;
        if (name && password) {
            client.execute(query, [name, password], function (err, result) {
                if (err) {
                    console.log("error during authentication: " + err);
                    isValid = false;
                } else {
                    if (result.rows.length > 0) {
                        console.log('Found a valid name password combination!');
                        isValid = true;
                    } else {
                        isValid = false;
                    }
                }
                callback(isValid);
            });
        } else {
            isValid = false;
            callback(isValid);
        }
    }
}