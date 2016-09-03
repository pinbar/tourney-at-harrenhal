var app = require("../../app");
var request = require("request");
var config = require("../../config");
var baseUrl = "http://localhost:" + config.serverPort + "/authenticate";

describe("API Authentication tests", function() {

    beforeAll(function() {
        app.start();
    });

    it("POST returns 200 for valid username password for jon", function(done){
        request.post({url: baseUrl, form: {name:"jon", password:"I know nothing"}}, function(error, response, body){
            expect(response.statusCode).toBe(200);
            expect(body).toContain("JWT");
            done();
        });
    });
    it("POST returns 200 for valid username password for tyrion", function(done){
        request.post({url: baseUrl, form: {name:"tyrion", password:"I know things"}}, function(error, response, body){
            expect(response.statusCode).toBe(200);
            expect(body).toContain("JWT");
            done();
        });
    });
    it("POST returns 401 for wrong password for jon", function(done){
        request.post({url: baseUrl, form: {name:"jon", password:"I know things"}}, function(error, response, body){
            expect(response.statusCode).toBe(401);
            expect(body).toBe("Wrong credentials");
            done();
        });
    });
    it("POST returns 401 for wrong password for tyrion", function(done){
        request.post({url: baseUrl, form: {name:"tyrion", password:"know things"}}, function(error, response, body){
            expect(response.statusCode).toBe(401);
            expect(body).toBe("Wrong credentials");
            done();
        });
    });
    it("POST returns 401 for unknown username", function(done){
        request.post({url: baseUrl, form: {name:"pin", password:"bar"}}, function(error, response, body){
            expect(response.statusCode).toBe(401);
            expect(body).toBe("Wrong credentials");
            done();
        });
    });
    it("POST returns 400 for empty username", function(done){
        request.post({url: baseUrl, form: {name:"", password:"I know things"}}, function(error, response, body){
            expect(response.statusCode).toBe(400);
            expect(body).toBe("Bad request");
            done();
        });
    });
    it("POST returns 400 for empty password", function(done){
        request.post({url: baseUrl, form: {name:"jon", password:""}}, function(error, response, body){
            expect(response.statusCode).toBe(400);
            expect(body).toBe("Bad request");
            done();
        });
    });
    it("POST returns 400 for empty username and password", function(done){
        request.post({url: baseUrl, form: {name:"", password:""}}, function(error, response, body){
            expect(response.statusCode).toBe(400);
            expect(body).toBe("Bad request");
            done();
        });
    });

    afterAll(function() {
        app.stop();
    });
});

