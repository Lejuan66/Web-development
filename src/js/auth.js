/*
 * Authenticatification of users
 */

/*
 * Constructor
 */
function Auth() {
	this.username = "";
	this.password = "";
	this.isAdmin = false;
	this.firstname = "";
	this.lastname = "";
	this.userId = 0;
	this.assets = null;
}

/*
 * Log in a user that been on the page before but did not log out
 * if the username and password still is stored in local storage
 */
Auth.prototype.init = function () {
	var deferred = $.Deferred();
	if (window.localStorage.username && window.localStorage.password) {
		this.login(window.localStorage.getItem("username"), window.localStorage.getItem("password")).then(function() {
			deferred.resolve();
		});
	} else {
		deferred.resolve();
	}
	return deferred.promise();
}

/*
 * Check if a user is loged in
 */
Auth.prototype.isLoggedIn = function() {
	return this.userId != 0;
}

/*
 * Validate that a user exists in the database and returns user information
 */
Auth.prototype.validateUser = function(username, password) {
	var deferred = $.Deferred();
	var user = this;
	var url = "http://pub.jamaica-inn.net/fpdb/api.php?username=" + username + "&password=" + password + "&action=iou_get";
	$.getJSON(url, function() {
	}).done(function(data) {
		if (data['payload'].length != 0 && data['payload'][0].hasOwnProperty("first_name")) {
			user.username 		= username;
			user.password 		= password;
			user.firstname 		= data['payload'][0]['first_name'];
			user.lastname 		= data['payload'][0]['last_name'];
			user.assets 		= data['payload'][0]['assets'];
			user.userId 		= data['payload'][0]['user_id'];
		}
	}).always(function (){
		deferred.resolve();
	});
	return deferred.promise();
}

/*
 * Validate that username and password belongs to a user with admin privalages.
 */
Auth.prototype.validateAdmin = function(username, password) {
	var deferred = $.Deferred();
	var u = this;
	var url = "http://pub.jamaica-inn.net/fpdb/api.php?username=" + username + "&password=" + password + "&action=payments_get_all";
	$.getJSON(url, function(data) {
		if (!data['payload'][0].hasOwnProperty("code")) {
			u.isAdmin = true;
		} else {
			u.isAdmin = false;
		}
	}).always(function() {
		deferred.resolve();
	});
	return deferred.promise();
}

/*
 * Login a user/admin, username and password is stored in local storage
 */
Auth.prototype.login = function(username, password) {
	window.localStorage.setItem("username", username);
	window.localStorage.setItem("password", password);
	var deferred = $.Deferred();
	var a = this;
	a.validateUser(username, password)
		.then(function() {
			a.validateAdmin(username, password).then(function() {
				d.loggedIn();
				if (this.isAdmin) {
					d.buidlAdmin();
				}
				deferred.resolve();
			});
		});
	return deferred.promise();
}

/*
 * Deconstructor
 */
Auth.prototype.logout = function() {
	this.username = "";
	this.password = "";
	this.isAdmin = false;
	this.firstname = "";
	this.lastname = "";
	this.userId = 0;
	this.assets = null;
	d.loggedOut();
	window.localStorage.removeItem("username");
	window.localStorage.removeItem("password");
}
