var app = require("../../app");
var request = require("request");
var config = require("../../config");
var baseUrl = "http://localhost:" + config.serverPort;

describe("Unsecure API tests", function() {

    beforeAll(function() {
        app.start();
    });

    it("GET base url returns 200", function(done){
        request.get(baseUrl, function(error, response, body){
            expect(response.statusCode).toBe(200);
            expect(body).toBe("Welcome to the Tourney at Harrenhal!");
            done();
        });
    });
    it("POST wrong method base url returns 404", function(done){
        request.post(baseUrl, function(error, response, body){
            expect(response.statusCode).toBe(404);
            done();
        });
    });
    it("GET dummy url returns 404", function(done){
        request.get(baseUrl + "/someApi", function(error, response, body){
            expect(response.statusCode).toBe(404);
            done();
        });
    });
    it("GET /metacortex returns 200", function(done){
        request.get(baseUrl + "/harrenhal", function(error, response, body){
            expect(response.statusCode).toBe(200);
            expect(body).toBe("This castle is not secured, anyone can just walk in!");
            done();
        });
    });

    afterAll(function() {
        app.stop();
    });
});