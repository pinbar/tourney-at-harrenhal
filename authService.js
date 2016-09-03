module.exports = {
    //ideally this will be a service/DB call
    authenticate: function(name, password) {
        if(name && password) {
            if(name === "jon") {
                if(password === "I know nothing") {
                    return true;
                } else {
                    return false;
                }
            } else if(name === "tyrion") {
                if(password === "I know things") {
                    return true;
                } else {
                    return false;
                }
            } else {
                return false;
            }
        } else {
            return false;
        }
    }
}