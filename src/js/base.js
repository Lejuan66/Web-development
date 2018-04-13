window.a_pi = new Api();
window.t = new Translate();
window.auth = new Auth();
window.d = new Display();
window.cat = [];
var topHeight = 255;

$(document).ready(function() {
	t.translate();
	var height = $(document).innerHeight() - topHeight;
	$(".tabcontent").css("height", height);
	
	auth.init().then(function() {
		console.log("Is logged in: ", auth.isLoggedIn());
		console.log("Is admin: ", auth.isAdmin);
	});
	
	a_pi.fetch("inventory_get", "jorass", "jorass").then(function(data) {
		$.each(data, function(key, value) {
			if (value.namn.length > 0 && value.pub_price.length > 0 && value.beer_id != 0) {
				d.beverage(value, "#catalog");
			}
		});
	});

	$("#loginform").submit(function(e) {
		console.log("we have submit!");
		var username = $("#username").val();
		var password = $("#password").val();
		$("#loginbutton").removeClass("green").html(t.t("loading"));
		
		auth.login(username, password).then(function(d) {
			if (!auth.isLoggedIn) {
				alert(t.t("login_failed"));
			}
			$("#loginbutton").addClass("green").html(t.t("login"));
		});
		e.preventDefault();
	});


	$(".tab").click(function() {

		var tab = ".tabcontent."+$(this).data('tabulate');

		$(".tab").removeClass("active");
		$(this).addClass("active");

		$(".tabcontent").hide();
		$(tab).show();

		var filter = $(this).data('filter');
		if (filter !== undefined) {

			$(tab).find(".filter").hide();
			$(tab).find(".filter."+ filter).show();
			if (filter != "all") {
				$(tab).find(".soldout").hide();
			}
		}

	});

    // Get the infoPopup
    var infoPopup = document.getElementById('moreInfo');
	// Get the <span> element that closes the infoPopup
    var span = document.getElementsByClassName("close")[0];

	// When the user clicks on <span> (x), close the infoPopup
    span.onclick = function() {
        infoPopup.style.display = "none";
        $("#beerInfo").empty();
    };

    // When the user clicks anywhere outside of the infoPopup, close it
    window.onclick = function(event) {
        if (event.target == infoPopup) {
            infoPopup.style.display = "none";
            $("#beerInfo").empty();
        }
    }
});




$(window).resize(function() {
	var height = $(window).innerHeight() - topHeight;
	$(".tabcontent").css("height", height);
});