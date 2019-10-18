(function () {
    //Submit Button Event Handler
    $("#submit").click(function(){
        console.log("submit button clicked!");
    //Get the value the user has entered in the search bar and store it
    const searchLocation = $("#searchBar").val();
    //Call the geocode function and pass in the value
        geocode(searchLocation);
    //Clear out the search bar
    $("#searchBar").val("");
    });

    $(document).on("click", "button#remove", function(){
        //Get the parent element of the button
        let parentDiv = $(this).parent();
        let weatherCardContainer = parentDiv.parent();
        weatherCardContainer.remove();
    })

})();


//Function to connect to the Dark Sky API and get weather data
function getWeatherInfo(latitude, longitude, city, state) {
    //Base-URL/APIKey/Latitude,Longitude

    $.ajax("https://api.darksky.net/forecast/" + darkSkyKey + "/" + latitude + "," + longitude, { dataType: "jsonp"})
    .done(function(data) {
        //Get the HTML from the div with the ID template
        let templateHTML = $("#template").html();

        let currentTemp = data.currently.temperature;
        let currentConditions = data.currently.summary;
        let currentDayInfo = data.daily.data[0];
        let highTemp = currentDayInfo.temperatureHigh; 
        let lowTemp = currentDayInfo.temperatureLow;
        let precipitation = currentDayInfo.precipProbability * 100;

        //Replacing the string @@city@@ with the city we pass into this function in the HTML
        templateHTML = templateHTML.replace("@@city@@", city);
        templateHTML = templateHTML.replace("@@state@@", state);
        templateHTML = templateHTML.replace("@@currentTemp@@", Math.round(currentTemp));
        templateHTML = templateHTML.replace("@@highTemp@@", Math.round(highTemp));
        templateHTML = templateHTML.replace("@@lowTemp@@", Math.round(lowTemp));
        templateHTML = templateHTML.replace("@@precipitation@@", (precipitation));
        templateHTML = templateHTML.replace("@@currentConditions@@", currentConditions);
        //Add the configured template HTML to our row in the card
        $(".row").append(templateHTML);

      
    })
    .fail(function(error) {
        console.log(error);
    })
    .always(function(){
        console.log("Weather call complete!");
    })
}

//Function to connect to the MapQuest Geocoding API and get geocoding data
function geocode(location){
    $.ajax("http://www.mapquestapi.com/geocoding/v1/address?key=" + mapQuestKey + "&location=" + location)
    .done(function(data){
        //Get the lat and lng from the response
        let locations = data.results[0].locations[0];

        let lat = locations.latLng.lat;

        let lng = locations.latLng.lng;

        let city = locations.adminArea5;

        let state = locations.adminArea3;

        //Pass the lat and lng to our getWeatherInfo function
        getWeatherInfo(lat, lng, city, state);

        console.log(city);
        console.log(state);


    })
    .fail(function(error){
        console.log(error);
    })
    .always(function(){
        console.log("Geocoding call finished");
    })

}