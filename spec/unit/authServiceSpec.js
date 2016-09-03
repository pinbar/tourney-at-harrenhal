var authService = require("../../authService");

describe("Dummy service for authentication", function(){

    describe("authenticate a program", function(){
        it("valid username and password for jon", function() {
            expect(authService.authenticate("jon", "I know nothing")).toBe(true);
        });
        it("valid username and password for tyrion", function() {
            expect(authService.authenticate("tyrion", "I know things")).toBe(true);
        });
        it("valid username but incorrect password", function() {
            expect(authService.authenticate("jon", "I know things")).toBe(false);
        });
        it("empty username and password", function() {
            expect(authService.authenticate("", "")).toBe(false);
        });
        it("empty username and some password", function() {
            expect(authService.authenticate("", "some")).toBe(false);
        });
        it("some username and empty password", function() {
            expect(authService.authenticate("some", "")).toBe(false);
        });
    });
});