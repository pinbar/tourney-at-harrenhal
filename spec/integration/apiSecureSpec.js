var app = require("../../app");
var request = require("request");
var config = require("../../config");
var baseUrl = "http://localhost:" + config.serverPort + "/api";
var authUrl = "http://localhost:" + config.serverPort + "/authenticate";
var jwtForjon;
var jwtFortyrion;

describe("Secure API tests", function() {

    beforeAll(function() {
        //get token for jon
        request.post({url: authUrl, form: {name:"jon", password:"I know nothing", house:"stark"}}, function(error, response, body){
            jwtForjon = body.replace("JWT: ", "");
        });
        //get token for tyrion
        request.post({url: authUrl, form: {name:"tyrion", password:"I know things", house:"lannister"}}, function(error, response, body){
            jwtFortyrion = body.replace("JWT: ", "");
        });
    });

    it("GET /castleblack without token returns 401", function(done){
        request.get(baseUrl + "/castleblack", function(error, response, body){
            expect(response.statusCode).toBe(401);
            expect(body).toBe("No access token found");
            done();
        })
    });
    it("GET /castleblack with jon's token returns 200", function(done){
        request.get({url: baseUrl + "/castleblack", headers: {Authorization:"Bearer "+ jwtForjon}}, function(error, response, body){
            expect(response.statusCode).toBe(200);
            expect(body).toBe("Welcome to Castle Black!");
            done();
        });
    });
    it("GET /winterfell with jon's token returns 200", function(done){
        request.get({url: baseUrl + "/winterfell", headers: {Authorization:"Bearer "+ jwtForjon}}, function(error, response, body){
            expect(response.statusCode).toBe(200);
            expect(body).toBe("jon, welcome to winterfell!");
            done();
        });
    });
    it("GET /winterfell with tyrion's token returns 403", function(done){
        request.get({url: baseUrl + "/winterfell", headers: {Authorization:"Bearer "+ jwtFortyrion}}, function(error, response, body){
            expect(response.statusCode).toBe(403);
            expect(body).toBe("tyrion, you are forbidden from entering winterfell!");
            done();
        });
    });
    it("GET /castleblack with a malformed token returns 401", function(done){
        request.get({url: baseUrl + "/harrenhal", headers: {Authorization:"Bearer "+ "some malformed jwt"}}, function(error, response, body){
            expect(response.statusCode).toBe(401);
            expect(body).toBe("Invalid Token. Error Message: JsonWebTokenError: jwt malformed");
            done();
        });
    });
    it("GET /castleblack with an invalid token returns 401", function(done){
        request.get({url: baseUrl + "/harrenhal", headers: {Authorization:"Bearer "+ "badHeader.badPayload.badSignature"}}, function(error, response, body){
            expect(response.statusCode).toBe(401);
            expect(body).toBe("Invalid Token. Error Message: JsonWebTokenError: invalid token");
            done();
        });
    });
    it("GET /castleblack with an invalid signature returns 401", function(done){
        request.get({url: baseUrl + "/harrenhal", headers: {Authorization:"Bearer "+ "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwcm9ncmFtIjoiOWMwMDUzIiwicm9sZSI6Ijg2MGQ1OTc5Mzk4NSIsImlhdCI6MTQ3MTA5ODY1MywiZXhwIjoxNDcxMDk4ODMzfQ.X0NsujGplPIVSJ4NrGoU1sNu7KWRN-bYCt3PHL10Vk"}}, function(error, response, body){
            expect(response.statusCode).toBe(401);
            expect(body).toBe("Invalid Token. Error Message: JsonWebTokenError: invalid signature");
            done();
        });
    });

});