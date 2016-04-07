var UserDetailsModel = function(username, password) {

    this.uname = username;
    this.pswd = password;
    this.getUsername = function() {
        return this.uname;
    };
    this.getPassword = function() {
        return this.pswd;
    };
    this.setUsername = function(username2) {
        this.uname = username2;
    };
    this.setPassword = function(password2) {
        this.pswd = password2;
    };
}
module.exports = UserDetailsModel;
