/*
 * API to fetch text fromatted in JSON
 */

/*
 * Constructor
 */
function Api() {
    $.ajaxSetup({
	scriptCharset: "utf-8",
	contentType: "application/json; charset=utf-8"
    });
}

/*
 * Generic function to fetch a specific funtion from the database
 * Arg: 
 *  - action   => specific funtion to fetch
 *  - username => username to authenticate
 *  - password => password to authenticate
 */
Api.prototype.fetch = function (action, username, password) {
    var deferred = $.Deferred();
    var url = "http://pub.jamaica-inn.net/fpdb/api.php?username=" + username + "&password=" + password + "&action=" + action;
    $.getJSON(url, function (data) {
	deferred.resolve(data['payload']);
    });
    return deferred.promise();
}

/*
 * Fetch the inventory from the database
 * Arg: 
 *  - username => username to authenticate
 *  - password => password to authenticate
 */
Api.prototype.inventory_get = function(username, password){
    var deferred = $.Deferred();
    var inventory_url = "http://pub.jamaica-inn.net/fpdb/api.php?username=" + username + "&password=" + password + "&action=inventory_get";
    $.getJSON(inventory_url, function (data){
	deferred.resolve(data['payload']);
    });
    return deferred.promise();
}

/*
 * Fetch all purchases for username  from the database
 * Arg: 
 *  - username => username to authenticate
 *  - password => password to authenticate
 */
Api.prototype.purchases_get = function(username, password) {

    var deferred = $.Deferred();
    var purchases_url = "http://pub.jamaica-inn.net/fpdb/api.php?username=" + username + "&password=" + password + "&action=purchases_get";
    $.getJSON(purchases_url, function(data){
	deferred.resolve(data['payload']);
    });
    return deferred.promise();
}


/*
 * Fetch all purchases for all user from the database
 * Arg: 
 *    Needs to be of an admin account
 *  - username => username to authenticate
 *  - password => password to authenticate
 */
Api.prototype.purchases_get_all = function(username, password) {
    var deferred = $.Deferred();
    var purchases_all_url = "http://pub.jamaica-inn.net/fpdb/api.php?username=" + username + "&password=" + password + "&action=purchases_get_all";
    $.getJSON(purchases_all_url, function(data){
	deferred.resolve(data['payload']);
    });
    return deferred.promise();
}

/*
 * Adds pruchase of beer_id to username:s account
 * Arg:
 *  - username => username to authenticate
 *  - password => password to authenticate
 *  - beer_id  => id of beer in database
 */
Api.prototype.purchases_append = function(username, password, beer_id){
    var deferred = $.Deferred();
    var purchases_append_url = "http://pub.jamaica-inn.net/fpdb/api.php?username=" + username + "&password=" + password + "&action=purchases_append&beer_id=" + "&beer_id=" + beer_id;
    console.warn(purchases_append_url);
    $.getJSON(purchases_append_url, function(data){
	if (data['type'] == "empty") {
	    deferred.resolve(true);
	} else {
	    deferred.resolve(false);
	}
    });
    return deferred.promise();
}

/*
 * Fetch username:s payments from the database
 * Arg: 
 *  - username => username to authenticate
 *  - password => password to authenticate
 */
Api.prototype.payments_get = function(username, password){
    var deferred = $.Deferred();
    var payments_url = "http://pub.jamaica-inn.net/fpdb/api.php?username=" + username + "&password=" + password + "&action=payments_get";
    $.getJSON(payments_url, function(data){
	deferred.resolve(data['payload']);
    });
    return deferred.promise();
}

/*
 * Fetch all payments for all users from the database
 * Arg: 
 *    Needs to be of an admin account
 *  - username => username to authenticate
 *  - password => password to authenticate
 */
Api.prototype.payments_get_all = function(username, password) {
    var deferred = $.Deferred();
    var payments_all_url = "http://pub.jamaica-inn.net/fpdb/api.php?username=" + username + "&password=" + password + "&action=payments_get_all";
    $.getJSON(payments_all_url, function (data) {
	deferred.resolve(data['payload']);
    });
    return deferred.promise();
}


/*
 * Adds a payment of amount to user_id:s account
 * Arg: 
 *  - username => username to authenticate
 *  - password => password to authenticate
 *  - amount   => integer
 *  - user_id  => user that placed payment
 */
Api.prototype.payments_append = function(username, password, amount, user_id){
    var deferred = $.Deferred();
    var payments_append_url = "http://pub.jamaica-inn.net/fpdb/api.php?username=" + username + "&password=" + password + "&action=payments_append&amount=" + amount +"&user_id=" + user_id;
    $.getJSON(payments_append_url, function(data){
	deferred.resolve(data);
    });
    return deferred.promise();
}

/*
 * Fetch username:s balance, a negative balance means that this user has
 * a debt of that ammount
 * Arg: 
 *  - username => username to authenticate
 *  - password => password to authenticate
 */
Api.prototype.iou_get = function(username, password){
    var deferred = $.Deferred();
    var iou_url = "http://pub.jamaica-inn.net/fpdb/api.php?username=" + username + "&password=" + password + "&action=iou_get";
    $.getJSON(iou_url, function(data){
	deferred.resolve(data['payload']);
    });
    return deferred.promise();
}


/*
 * Fetch all users balance, a negative balance means that a specific user
 * has a debt of that ammount
 * Arg: 
 *  - username => username to authenticate
 *  - password => password to authenticate
 */
Api.prototype.iou_get_all = function(username, password) {
    var deferred = $.Deferred();
    var iou_all_url = "http://pub.jamaica-inn.net/fpdb/api.php?username=" + username + "&password=" + password + "&action=iou_get_all";
    $.getJSON(iou_all_url, function (data) {
	deferred.resolve(data['payload']);
    });
    return deferred.promise();
}


/*
 * Fetch extendended information for a specified beverage
 * Arg: 
 *  - username => username to authenticate
 *  - password => password to authenticate
 *  - beer_id  => id of beverage
 */
Api.prototype.beer_data_get = function(username, password, beer_id){
    var deferred = $.Deferred();
    var beer_data_url = "http://pub.jamaica-inn.net/fpdb/api.php?username=" + username + "&password=" + password + "&action=beer_data_get" + "&beer_id=" + beer_id;
    $.getJSON(beer_data_url, function(data){
	deferred.resolve(data['payload']);
    });
    return deferred.promise();
}

/*
 * Update user information / create new user
 * Arg: 
 *  - username     => username to authenticate
 *  - password     => password to authenticate
 *  - new_username => New username
 *  - new_password => New password
 *  - first_name   => First name of user
 *  - last_name    => Last name of user
 *  - email        => User e-mail
 *  - phone        => User phone
 */
Api.prototype.user_edit = function(username, password, new_username, new_password, first_name, last_name, email, phone ) {
    var deferred = $.Deferred();
    var user_edit_url = "http://pub.jamaica-inn.net/fpdb/api.php?username=" + username + "&password=" + password + "&action=user_get_all";
    $.getJSON(user_edit_url, function (data) {
	deferred.resolve(data['payload']);
	for (var i =0; i < data.payload.length; i++){
	    if(data.payload[i].first_name ==first_name && data.payload[i].last_name ==last_name){
		data.payload[i].username = new_username;
		data.payload[i].password = new_password;
		data.payload[i].eamil = email;
		data.payload[i].phone = phone;
		return deferred.promise();
	    }
	}
    });
}

/*
 * Fetch all users from the database
 * Arg: 
 *  - username => username to authenticate
 *  - password => password to authenticate
 */
Api.prototype.user_get_all = function(action, username, password){
    var deferred = $.Deferred();
    var user_all_url = "http://pub.jamaica-inn.net/fpdb/api.php?username=" + username + "&password=" + password + "&action =" + action;
    $.getJSON(user_all_url, function (data) {
	deferred.resolve(data['payload']);
    });
    return deferred.promise();

}
