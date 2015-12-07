// Note: This example requires that you consent to location sharing when
// prompted by your browser. If you see the error "The Geolocation service
// failed.", it means you probably did not give permission for the browser to
// locate you.
var map;
var geoCoder;

function initMap() {
  	map = new google.maps.Map(document.getElementById('map'), {
    	center: {lat: 47.6097, lng: -122.3331},
    	zoom: 12
	});


	geoCoder = new google.maps.Geocoder();

  // Try HTML5 geolocation.
	if (navigator.geolocation) {
  		navigator.geolocation.getCurrentPosition(function(position) {
  			var pos = {
  				lat: position.coords.latitude,
  				lng: position.coords.longitude
  			};

  			map.setCenter(pos);
  		}, function() {
  			handleLocationError(true, infoWindow, map.getCenter());
  		});
	} else {
    	// Browser doesn't support Geolocation
    	handleLocationError(false, infoWindow, map.getCenter());
	}
}

var handleLocationError = function(browserHasGeolocation, infoWindow, pos) {
  infoWindow.setPosition(pos);
  infoWindow.setContent(browserHasGeolocation ?
                        'Error: The Geolocation service failed.' :
                        'Error: Your browser doesn\'t support geolocation.');
};

//This should be a promise
var geocodeAddress = function(address) {
	geoCoder.geocode({'address':address}, function(results, status){
		if(status === google.maps.GeocoderStatus.OK){
			console.log("The destination: " + results[0].geometry.location)
			return results[0].geometry.location;
		} else {
			console.log("A problem occurred")
		}
	})
}

var app = angular.module("mapApp", [])
	.controller("mapController", function($scope){
		$scope.query = {};

		//Add a new marker to the map
		$scope.submit = function() {
			//Makes a popup with desired information
			var contentString = "<h3>" + $scope.query.name + "</h3>" +
			"<p>Destination: " +
			$scope.query.destString + 
			"</p> <p>Umbrella: ";

			if($scope.query.umbrella) {
				contentString += "Yes. </p>";
			} else {
				contentString += "No </p>";
			}

			var infoWindow = new google.maps.InfoWindow({
				content: contentString
			});

			//Geocode the destination location, and set the marker afterwards
			var $scope.query.destPos = geocodeAddress($scope.query.destString).then(function(geolocale){
				var marker = new google.maps.Marker({
					position: $scope.query.destPos,
					map:map
				});
				console.log("The Marker: " + marker)

				marker.addListener('click', function(){
					infoWindow.open(map,marker);
				})
				console.log("Done.")
			})
				
		}
	})







