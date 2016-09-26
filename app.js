var express = require("express");
var morgan = require("morgan");
var bodyParser = require("body-parser");
var jsonwebtoken = require("jsonwebtoken");
var config = require("./config");
var logger = require("./logger");
var authService = require("./authService");
var userService = require("./userService");
var cryptoUtil = require("./cryptoUtil");

var app = express();

var jsonParse = bodyParser.json();
var urlEncodedParser = bodyParser.urlencoded({ extended: false });

//for static resources
app.use(express.static("static"));

//load logger after static to ignore static logging
app.use(morgan("dev", { "stream": logger.stream }));

app.get("/", function (request, response) {
    response.redirect("/api/");
});

app.get("/api/", function (request, response) {
    response.send("Welcome to the Tourney at Harrenhal!");
});

app.get("/api/users", function (request, response) {
    userService.getUsers(function (error, results) {
        if (error) {
            logger.log("sending results: " + results);
            return response.status(500).send("An unexpected error occurred!");
        } else if (results.size < 1) {
            return response.status(404).send("Users not found!");
        } else {
            logger.log("sending results: " + results);
            response.status(200).send(results);
        }
    });
});

app.get("/api/harrenhal", function (request, response) {
    response.status(200).send("This castle is not secured, anyone can just walk in!");
});

app.post("/api/authenticate", jsonParse, function (request, response) {
    var name = request.body.name;
    var password = request.body.password;
    var house = request.body.house;
    console.log(request.body);
    if (!name || !password) {
        response.status(400).send("Bad request");
    } else {
        authService.authenticate(name, password, function (isValid) {
            if (isValid) {
                var claim = {
                    name: cryptoUtil.encrypt(name),
                    house: cryptoUtil.encrypt(house)
                }
                var token = jsonwebtoken.sign(claim, config.jwtSecret, {
                    expiresIn: config.jwtExpiresInSec
                });
                response.send("JWT: " + token);
            } else {
                return response.status(401).send("Wrong credentials");
            }
        });
    }
});

var secureRouter = express.Router();
secureRouter.use(function (request, response, next) {
    var token = request.get("Authorization");
    if (token && token.includes("Bearer")) {
        token = token.replace("Bearer ", "");
        jsonwebtoken.verify(token.trim(), config.jwtSecret, function (error, decoded) {
            if (error) {
                logger.error("jwt error: " + error);
                response.status(401).send("Invalid Token. Error Message: " + error);
            } else {
                request.decodedToken = decoded;
                return next();
            }
        });
    } else {
        response.status(401).send("No access token found");
    }
});
//any routes that use secureRouter will be protected
app.use("/api/secure", secureRouter);

secureRouter.get("/castleblack", function (request, response) {
    response.send("Welcome to Castle Black!");
});

secureRouter.get("/winterfell", function (request, response) {
    var encryptedHouse = request.decodedToken.house;
    var house = cryptoUtil.decrypt(encryptedHouse);
    var encryptedName = request.decodedToken.name;
    var name = cryptoUtil.decrypt(encryptedName);
    if (house === "stark") {
        response.send(name + ", welcome to winterfell!");
    } else {
        response.status(403).send(name + ", you are forbidden from entering winterfell!");
    }
});

//default fallthrough handler
app.use(function (req, res) {
    res.status(404).send("Resource Not Found");
});

var server;
module.exports = {
    start: function () {
        server = app.listen(config.serverPort, function () {
            logger.info("app started");
        });
    },
    stop: function () {
        server.close(function () {
            logger.info("app stopped");
        });
    }
}