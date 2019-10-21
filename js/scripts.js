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
        let weatherIcon = data.currently.icon;

        //Replacing the string @@city@@ with the city we pass into this function in the HTML
        templateHTML = templateHTML.replace("@@city@@", city);
        templateHTML = templateHTML.replace("@@state@@", state);
        templateHTML = templateHTML.replace("@@currentTemp@@", Math.round(currentTemp));
        templateHTML = templateHTML.replace("@@highTemp@@", Math.round(highTemp));
        templateHTML = templateHTML.replace("@@lowTemp@@", Math.round(lowTemp));
        templateHTML = templateHTML.replace("@@precipitation@@", (precipitation));
        templateHTML = templateHTML.replace("@@currentConditions@@", currentConditions);
        templateHTML = templateHTML.replace("@@imageURL@@", getBackgroundPath(weatherIcon));

        for (var i = 0; i < 5; i++){
            //Set the date for each day
            if (i > 0) {
                let date = new Date();
                date.setDate(date.getDate() + i);

                let month = date.getMonth() + 1;
                let day = date.getDate();

                templateHTML = templateHTML.replace("@@date" + i + "@@", month + "/" + day);
            }
            let currentDayWeatherData = data.daily.data[i];
            templateHTML = templateHTML.replace("@@max" + i + "@@", Math.round(currentDayWeatherData.temperatureMax));
            templateHTML = templateHTML.replace("@@low" + i + "@@", Math.round(currentDayWeatherData.temperatureMin));
            templateHTML = templateHTML.replace("@@precip" + i + "@@", Math.round(currentDayWeatherData.precipProbability * 100));
                }
        //Add the configured template HTML to our row in the card
        $(".row").append(templateHTML);

      
    })
    .fail(function(error) {
        console.log(error);
    })
    .always(function(){
        console.log("Weather ca l complete!");
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

function getBackgroundPath(iconString){
    //Create a switch statement that switches based on the value of iconString. For each case, it should return the path to the appropriate image for that iconString value. By default, it should return the path to the clear-day image.

    switch(iconString){
        case "clear-day":
            return "../img/clear-day.jpg";
        case "clear-night":
            return "../img/clear-night.jpg";
        case "cloudy":
            return "../img/cloudy.jpg";
        case "fog":
            return "../img/fog.jpg";
        case "partly-cloudy-day":
            return "../img/partly-cloudy-day.jpg";
        case "partly-cloudy-night":
            return "../img/partly-cloudy-night.jpg";
        case "rain":
            return "../img/rain.jpg";
        case "sleet":
            return "../img/sleet.jpg";
        case "snow":
            return "../img/snow.jpg";
        case "wind":
            return "../img/wind.jpg";
        default:
            return "../img/clear-day.jpg";
    }


}