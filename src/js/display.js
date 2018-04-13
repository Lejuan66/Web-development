/*
 * File: display.js
 * Brief: Generate content to display
 */

/*
 * Constructor
 */
function Display () {
    this.cart = {};
    this.sum = 0;
    this.information = {};
    this.undomanager = new Undo();
}

/*
 * Generates a <div> for a item and inserters it at location
 * Arg:
 *  - item     = object containting:
 *                              => name
 *                              => name2 (alternative name)
 *                              => price
 *                              => quantity
 *  - location = location to insert object
 */
Display.prototype.beverage = function(item, location) {
    var html = $("<div />")
	.addClass("filter all product")
	.attr("data-id", item.beer_id)
	.attr("data-count", item.count)
	.attr("data-price", item.pub_price)
	.attr("data-name", item.namn)
	.attr("draggable", "true")
	.attr("ondragstart", "drag_handler(event)") //triggers the DnD-handler
	.append(
	    $("<div/>").addClass("info").append("<button data-translation='info' style='height:25px;line-height:25px;font-size:14px;'></button>").attr("onClick", "d.toggleInfo("+ item.beer_id +")"),
	    $("<div/>").addClass("name").text(item.namn),
	    $("<div/>").addClass("name2").text(item.namn2),
	    $("<div/>").addClass("price").text(item.pub_price + " SEK"),
	    $("<div/>").addClass("quantity").html("<span class='q'>"+ Math.max(item.count, 0) +"</span>" + " <span data-translate=\"st\">st</span>")
	);
    if (item.beer_id > 600000 && item.beer_id < 800000) { // if beverage is wine
	html.addClass("wine");
    } else {
	html.addClass("beer");
    }
    if (item.count < 1) {
	html.addClass("soldout");
	html.hide();
    }

    $(location).append(html);
    t.translate();
}

/*
 * Undo last action if there are any action(s)
 */
Display.prototype.undo = function() {
    if (this.undomanager.undoCheck()) {
	this.undomanager.undo();
	this.render();
    }
}

/*
 * Redo last action if there are any action(s)
 */
Display.prototype.redo = function() {
    if (this.undomanager.redoCheck()) {
	this.undomanager.redo();
	this.render();
    }
}

/*
 * Add one of the beverage(id) to cart and update beverage stock in catalog
 */
Display.prototype.add = function(id, save = true) {
    var product = $(".product[data-id='"+ id +"']");
    var c = product.attr('data-count');

    if (save) {
	this.undomanager.add("add", "sub", id);
    }
    if (c > 0) {
	c--;
	if (c == 0) {
	    product.addClass("soldout");
	}
	product.attr("data-count", c);
	product.find(".q").text(c);
	if (id in this.cart) {
	    this.cart[id]['q']++;
	} else {
	    var name = product.attr("data-name");
	    var price = product.attr("data-price");
	    this.cart[id] = { "name" : name, "q": 1, "price": price};
	}
    }
    this.render();
    this.highlight(id);
}

/*
 * Remove one of the beverage(id) from the cart and update beverage stock in catalog
 */
Display.prototype.sub = function(id, save = true) {
    var product = $(".product[data-id='"+ id +"']");
    var c = product.attr('data-count');

    if (save) {
	this.undomanager.add("sub", "add", id);
    }
    c++;
    product.removeClass("soldout");
    product.attr("data-count", c);
    product.find(".q").text(c);

    this.cart[id]['q']--;
    if (this.cart[id]['q'] == 0) {
	delete this.cart[id];
    }

    this.render();
}

/*
 * Render the shopping cart with beverages, undo/redo and order/cancel buttons
 */
Display.prototype.render = function() {
    this.sum = 0;
    var self = this;
    $(".cart").html("");
    $.each(this.cart, function(key,value) {
	self.sum = self.sum + (parseFloat(value.price) * parseInt(value.q));
	var i = $("<div />").addClass("cart_item").attr("id", "cart" + key).append(
            $("<div />").addClass("name").text(value.name),
            $("<div />").addClass("price").text(value.price + " SEK"),
            $("<button />").addClass("sub red").text("-").attr("onClick", "d.sub('"+ key+ "')"),
            $("<div />").addClass("quantity").text(value.q),
            $("<button />").addClass("add green").text("+").attr("onClick", "d.add('"+ key+ "')")
        );

	$(".cart").append(i);
    });

    $("#totalsum").html("<b>" + this.sum + "</b> SEK");
    if (this.undomanager.undoCheck()) {
	$("#undo").addClass("undo");
    } else {
	$("#undo").removeClass("undo");
    }

    if (this.undomanager.redoCheck()) {
	$("#redo").addClass("redo");
    } else {
	$("#redo").removeClass("redo");
    }

    if ($.isEmptyObject(this.cart)) {
	$("#order").removeClass("green");
	$("#cancel").removeClass("red");
    } else {
	$("#order").addClass("green");
	$("#cancel").addClass("red");
    }
}

/*
 * Promts a message to the user and triggers empty if confirmed
 */
Display.prototype.clear = function() {
    var c = confirm(t.t("clear_cart_question"));
    if (c) {
	this.empty();
    }
}

/*
 * Empty the cart of beverages and clear the undo/redo-manager
 */
Display.prototype.empty = function() {
    
    var self = this;
    $.each(this.cart, function(key, value) {
	var i = value['q'];
	for (; i > 0; i--) {
	    self.sub(key, false);
	}
    });
    this.undomanager.clear();
    this.render();
}

/*
 * Places the order of beverages to a users account, empty the cart and show a promt to the user
 */
Display.prototype.checkout = function() {
    if (!$.isEmptyObject(this.cart)) {

	var arr = [];
	var self = this;
	$.each(this.cart, function(key,value) {
	    var i = value['q'];
	    for (; i > 0; i--) {
		arr.push(key);
	    }
	});

	this.purchases_append(arr);
	this.profilepageValues();
	this.empty();
	alert(t.t("order_done"));
    }
}



/* 
 * Appends extended information about each beverage to the extended beerInfo pop-up 
 * Arg:
 *  - id => beverage id to be fetched and displayed
 */
Display.prototype.toggleInfo = function(id) {
    var product = $(".product[data-id='"+ id +"']");

    var popup = $("#beerInfo"); //location of popup
    var moreinfo = document.getElementById("moreInfo"); //location of table #moreInfo

    a_pi.beer_data_get(auth.name, auth.password, id).then(function(data){
        $.each(data[0], function(k, v) {
            if (k != "slutlev" && v != "") { //ignore key specific keys
                var val;
                if (k == 'ekologisk' || k == 'koscher'){ //convert specific keys
                    if (v == 0) {
                        v = "no";
                    }
                    else if (v == 1) {
                        v = "yes";
                    }
                    val =  $("<td />").attr("data-translation", v);
		}
                else if (translations.hasOwnProperty(v)) { //check if there is a translation available
                    val =  $("<td />").attr("data-translation", v)
                }
                else {
                	val =  $("<td />").text(v);
                }

                var key = $("<tr />")
		    .append($("<td />")
			    .attr("data-translation", k)
			   ).append(val);

                popup.append(key);
            }
        });
        t.translate();
    });
    moreinfo.style.display = "block"; //displays the pop-up
};


/*
 * Highlight a beverage in the cart by id
 */
Display.prototype.highlight = function(id) {
    $("#cart" + id + " > div").fadeTo(100, 0.1).fadeTo(200, 1.0);
};

/*
 * Update tables in users profile tab with current purchases, payments and account balance
 */
Display.prototype.profilepageValues = function() {
    
    a_pi.purchases_get(auth.username, auth.password).then(function(d) {
	$("#my_purchases").html("");
	var html = $("#my_purchases");
	$.each(d, function(k, v) {
	    html.append(
		$("<tr/>").append(
		    $("<td/>").text(v.timestamp),
		    $("<td/>").text(v.namn),
		    $("<td/>").text(v.price)
		    
		)
	    );
	});
    });
    a_pi.payments_get(auth.username, auth.password).then(function(d) {
	var html = $("#my_payments");
	$("#my_payments").html("");
	$.each(d, function(k, v) {
	    html.append(
		$("<tr/>").append(
		    $("<td/>").text(v.timestamp),
		    $("<td/>").text(v.amount)
		    
		)
	    );
	});
    });
    a_pi.iou_get(auth.username, auth.password).then(function(d) {
	$("#my_iou").html("");
	var html = $("#my_iou");
	html.append(
	    $("<tr/>").append(
		$("<td/>").text(d[0].assets),
		$("<td/>").text("SEK")
	    )
	);
    });

}

/*
 * Creates content for the users profile page.
 * E.g:
 * [greeting] [first_name] [last_name]
 *          [log_out:button]
 */
Display.prototype.buildProfile = function() {
    if (auth.isAdmin) {
	this.buildAdmin();
    }
    var name = auth.firstname + " " + auth.lastname;
    var html = $("<div/>").addClass("name").append(
	$("<div/>").css("text-align", "center").append(
	    $("<span/>").attr("data-translation", "hi").css("width", "25%"),
	    $("<span/>").text(" " + name).css("width", "75%")
	),
	$("<div/>").css("margin", "30px").append(
	    $("<button/>").attr("onClick", "auth.logout();").attr("data-translation", "logout").addClass("red").css({"width": "97%", "clear": "both"})
	)
    );
    $(".profile").show().append(html);
    t.translate();
    this.profilepageValues();
}

/*
 * Create admin-tabs
 */
Display.prototype.buildAdmin = function () {
    $("div[data-tabulate='user_admin']").show();
    $("div[data-tabulate='table_view']").show();
    this.buildAdmin_purchases();
    this.buildAdmin_payments();
    this.buildAdmin_debts();
    this.builAdmin_table_page();
}
/**
 * Create the table overview page.
 */
Display.prototype.builAdmin_table_page = function() {
	var markup = $("<div/>").addClass("tables").append(
		$("<div/>").attr("id", "table1").append($("<div/>").addClass("tableid").text("1"), $("<div/>").addClass("notification").text("5")),
		$("<div/>").attr("id", "table2").append($("<div/>").addClass("tableid").text("2"), $("<div/>").addClass("notification").text("3")),
		$("<div/>").attr("id", "table3").append($("<div/>").addClass("tableid").text("3")),
		$("<div/>").attr("id", "table4").append($("<div/>").addClass("tableid").text("4")),
		$("<div/>").attr("id", "table5").append($("<div/>").addClass("tableid").text("5"))
	);

	$("#table_view").append(markup);

	$("#table1").on("click", function() {
		var r = confirm("Accept order: 5 BrewDog Trashy");
		if (r){
			$("#table1 > .notification").hide();
		}
	});
	$("#table2").on("click", function() {
		var r = confirm("Accept order: 3 BrewDog Trashy");
		if (r){
			$("#table2 > .notification").hide();
		}
	});
}

/*
 * Generate user purchase content for admin-tabs
 */
Display.prototype.buildAdmin_purchases = function () {
    var mnt = $("#user_purchases");
    mnt.html("");

    a_pi.purchases_get_all(auth.username, auth.password).then(function(d){
	$.each(d, function(k,v){
	    mnt.append(
		$("<tr/>").append(
		    $("<td/>").text(v.timestamp),
		    $("<td/>").text(v.username),
		    $("<td/>").text(v.namn),
		    $("<td/>").text(v.price)
		)
	    );
	});
    });

}


/*
 * Generate user payments content for admin-tabs
 */
Display.prototype.buildAdmin_payments = function () {
    var mnt = $("#user_payments");
    mnt.html("");
    a_pi.payments_get_all(auth.username, auth.password).then(function(d){
	$.each(d, function(k,v){
	    mnt.append(
		$("<tr/>").append(
		    $("<td/>").text(v.timestamp),
		    $("<td/>").text(v.username),
		    $("<td/>").text(v.amount)
		)
	    );
	});
    });
}


/*
 * Generate user account balance content for admin-tabs
 */
Display.prototype.buildAdmin_debts = function () {
    var mnt = $("#user_debts");
    mnt.html("");
    a_pi.iou_get_all(auth.username, auth.password).then(function(d){
	$.each(d, function(k,v){
	    mnt.append(
		$("<tr/>").append(
		    $("<td/>").text(v.username),
		    $("<td/>").text(v.first_name),
		    $("<td/>").text(v.last_name),
		    $("<td/>").text(v.assets)
		)
	    );
	});
    });
}

/*
 * Hides log in page, shows cart, show user profile and show DnD-tutorial/animation
 */
Display.prototype.loggedIn = function() {
    if (auth.isLoggedIn()) {
	$(".login").hide();
	$("#orderdiv").show();
	$("div[data-tabulate='profiletab']").show();
	this.buildProfile();
	this.dndAnimate();
    } else {
	alert(t.t("login_failed"));
    }
}

/*
 * Hides and disable elemnts that a not autenticated user should see
 */
Display.prototype.loggedOut = function() {
    $("div[data-tabulate='profiletab']").hide();
    $("div[data-tabulate='user_admin']").hide();
    $("div[data-tabulate='table_view']").hide();
    $(".tabcontent").hide();
    $("#catalog").show();
    $(".tab").removeClass("active");
    $("#origin").addClass("active");
    $("#my_purchases").html("");
    $("#table_view").html("");
    $("#my_payments").html("");
    $("#my_iou").html("");
    $(".login").show();
    $(".profile").html("").hide();
    $("#orderdiv").hide();
    this.empty();
}

/*
 * Promt payment message to the user and trigger paymentprocess
 */
Display.prototype.makePayment = function() {
    if (auth.isLoggedIn()) {
	var self = this;
	var a = window.prompt(t.t("pay_how_much"));
	if (a) {
	    if (!isNaN(a) && a > 0) {
		a_pi.payments_append(auth.username, auth.password, a, auth.userId).then(function(data) {
		    self.profilepageValues();
		});
	    } else {
		alert(t.t("error_non_numeric"));
	    }
	}
    }
}

/*
 * Trigger a purchas
 */
Display.prototype.purchases_append = function (arr) {
    console.log("got array: ", arr);
    var self = this;
    if (arr.length != 0) {
	var i = arr.pop();
	a_pi.purchases_append(auth.username, auth.password, i).then(function () {
	    console.log("runinng next step with: ", arr);
	    d.purchases_append(arr);
	});
    } else {
	self.profilepageValues();
    }
}

/*
 * Tutorial animation of how DnD from catalog to cart works
 */
Display.prototype.dndAnimate = function () {
    var l = $(window).innerWidth() - 100;
    $("#finger")
	.show()
	.animate({
	    top: 300,
	    left: 100
	}, 1000, function() {
	    $(this)
		.attr("src", "img/finger_down.png")
		.animate({
		    left: l,
		    top: 400
		}, 2000, function() {
		    $(this).attr("src", "img/finger_up.png");
		    window.setInterval(function() {
			$("#finger").hide();
		    }, 500);
		});
	});
}
