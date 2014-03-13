// ---------------------------------------------------------------------------
// FILE: textinput.js
// DESCRIPTION: Textinput GUI code
// DATE: 01/12/2013
// HISTORY:
// ---------------------------------------------------------------------------

// current state
function loadedNews(data) {
	// TODO: automatically set center of the map and zoom according to the clusters	
	// initialize Google maps
	var latlng = new google.maps.LatLng(45.0, 13);
	var myOptions = {
		zoom: 4,
		center: latlng,
		mapTypeControlOptions: {style: google.maps.MapTypeControlStyle.DROPDOWN_MENU, position: google.maps.ControlPosition.RIGHT_BOTTOM},
		mapTypeId: google.maps.MapTypeId.ROADMAP
	};	
	map = new google.maps.Map(document.getElementById("map_canvas"), myOptions);  
	 	
	console.log(data);
	nodes = JSON.parse(data);
	for (i = 0; i < nodes.length; i++) {
		console.log(nodes[i].Name);
		console.log(nodes[i].Position[0]);
		// create marker	
		var markerLatLng = new google.maps.LatLng(nodes[i].Position[0], nodes[i].Position[1]);	
		var the_marker = new google.maps.Marker({
			position: markerLatLng,
			title: nodes[i].Name,
			map: map,
			clickable: true
		});  
		the_marker.setMap(map);
	}	
}

// load tweet
function loadedTweet(data) {
	console.log(data);
	news = JSON.parse(data);
	
	HTML = "<h3>User: " + news.User + "</h3>";
	HTML += "<b>Id: " + news.id + "</b><br>";
	HTML += "<b>Date: " + news.Date + "</b><br><br>";	
	HTML += news.Text;
	HTML 
	$("#div-full-news").html(HTML);
}

function loadTweet(id) {
	$.ajax({
		url: '/api/get-tweet?p=' + id,
		success: loadedTweet
	});		
}

// load news item
function loadedNewsItem(data) {
	console.log(data);
	news = JSON.parse(data);
	
	HTML = "<h3>Title: " + news.Title + "</h3>";
	HTML += "<b>Id: " + news.id + "</b><br>";
	HTML += "<b>Date: " + news.Date + "</b><br><br>";	
	HTML += news.Text;
	HTML 
	$("#div-full-news").html(HTML);
}

function loadNews(id) {
	$.ajax({
		url: '/api/get-news?p=' + id,
		success: loadedNewsItem
	});		
}

// main function				  		
$(function() {
	$.ajax({
	  url: '/api/get-news-positions',
	  success: loadedNews
	});
});
