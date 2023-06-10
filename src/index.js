//Code to get the weather API information 
let apiKey = "26415e217d517b2635491d848dd18196";
let units = "metric";


function currentLocation(position) {
  let lat = position.coords.latitude;
  let lon = position.coords.longitude;
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=${units}`;
  //console.log(lat);
  //console.log(lon);

  axios.get(apiUrl).then(showLocation);
  axios.get(apiUrl).then(showCurrentTemp);
}


navigator.geolocation.getCurrentPosition(currentLocation);

function showLocation(location) {
  let currentLocation = location.data.name;
  //console.log(currentLocation);
  //console.log(location);
  let currentLocationHTML = document.querySelector("#city-name");
  currentLocationHTML.innerHTML = currentLocation;
}


function showCurrentTemp(response) {
  let currentTemp = Math.round(response.data.main.temp);
  //console.log(currentTemp);
  //console.log(response);
  let currentTempHTML = document.querySelector("#current-temp-num");
  currentTempHTML.innerHTML = currentTemp;
  
  let celsiusElement = document.querySelector("#celsius");
  celsiusElement.addEventListener("click", function() {
    temperatureConversion("celsius");
  });

  let fahrenheitElement = document.querySelector("#fahrenheit");
  fahrenheitElement.addEventListener("click", function() {
    temperatureConversion("fahrenheit");
  });

  let currentTypeTemp = "celsius";

  function temperatureConversion(temperatureType) {
    let currentTempHTML = document.querySelector("#current-temp-num");
    let fahrenheitHTML = document.querySelector("#fahrenheit");
    let celsiusHTML = document.querySelector("#celsius");

    if (temperatureType === "fahrenheit" && currentTypeTemp !== "fahrenheit") {
      currentTempHTML.innerHTML = Math.round(convertToFahrenheit(currentTemp));
      currentTemp = convertToFahrenheit(currentTemp);
      fahrenheitHTML.classList.add("selectedTemperature");
      celsiusHTML.classList.remove("selectedTemperature");
    } else if (temperatureType === "celsius" && currentTypeTemp !== "celsius") {
      currentTempHTML.innerHTML = Math.round(convertToCelsius(currentTemp));
      currentTemp = convertToCelsius(currentTemp);
      celsiusHTML.classList.add("selectedTemperature");
      fahrenheitHTML.classList.remove("selectedTemperature");
    }
    currentTypeTemp = temperatureType;
  }
  function convertToFahrenheit(celsius) {
    let fahrenheit = (celsius * 9) / 5 + 32;
    return fahrenheit;
  }
  
  function convertToCelsius(fahrenheit) {
    let celsius = ((fahrenheit - 32) * 5) / 9;
    return celsius;
}
  }

function getCurrentLocation(){
  navigator.geolocation.getCurrentPosition(currentLocation);
}
let currentLocationBtn = document.querySelector("#current-location-button");
currentLocationBtn.addEventListener("click", getCurrentLocation);



let city;

function showCity(cityData) {
  let showCitySearch = cityData.data.name;
  //console.log(showCitySearch);
  //console.log(cityData);
  let showCitySearchHTML = document.querySelector("#city-name");
  showCitySearchHTML.innerHTML = showCitySearch;

  city = showCitySearch;
}

function searchCity(cityInput) {
  let apiUrlCity = `https://api.openweathermap.org/data/2.5/weather?q=${cityInput}&appid=${apiKey}&units=${units}`;
  axios.get(apiUrlCity).then(showCity);
  axios.get(apiUrlCity).then(showTemp);
}

let showCityElement = document.querySelector("#search-city");
showCityElement.addEventListener("submit", function(event) {
  event.preventDefault();
  let cityInput = document.querySelector("#search-city-input").value;
  searchCity(cityInput);
});

function showTemp(temperature) {
  let searchCityTemp = Math.round(temperature.data.main.temp);
  //console.log(searchCityTemp);
  //console.log(temperature);
  let searchCityTempHTML = document.querySelector("#current-temp-num");
  searchCityTempHTML.innerHTML = searchCityTemp;

  let celsiusElement = document.querySelector("#celsius");
  celsiusElement.addEventListener("click", function() {
    temperatureConversion("celsius");
  });

  let fahrenheitElement = document.querySelector("#fahrenheit");
  fahrenheitElement.addEventListener("click", function() {
    temperatureConversion("fahrenheit");
  });

  let currentTypeTemp = "celsius";

  function temperatureConversion(temperatureType) {
    let currentTempHTML = document.querySelector("#current-temp-num");
    let fahrenheitHTML = document.querySelector("#fahrenheit");
    let celsiusHTML = document.querySelector("#celsius");

    if (temperatureType === "fahrenheit" && currentTypeTemp !== "fahrenheit") {
      currentTempHTML.innerHTML = Math.round(convertToFahrenheit(searchCityTemp));
      searchCityTemp = convertToFahrenheit(searchCityTemp);
      fahrenheitHTML.classList.add("selectedTemperature");
      celsiusHTML.classList.remove("selectedTemperature");
    } else if (temperatureType === "celsius" && currentTypeTemp !== "celsius") {
      currentTempHTML.innerHTML = Math.round(convertToCelsius(searchCityTemp));
      searchCityTemp = convertToCelsius(searchCityTemp);
      celsiusHTML.classList.add("selectedTemperature");
      fahrenheitHTML.classList.remove("selectedTemperature");
    }
    currentTypeTemp = temperatureType;
  }
  function convertToFahrenheit(celsius) {
    let fahrenheit = (celsius * 9) / 5 + 32;
    return fahrenheit;
  }
  
  function convertToCelsius(fahrenheit) {
    let celsius = ((fahrenheit - 32) * 5) / 9;
    return celsius;
  }
}

//Code to change weekly days and to get the information about today's weekday and time
let now = new Date();

let days = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday"
];
let weekDay = days[now.getDay()];

let hours = String(now.getHours()).padStart(2, "0");
let minutes = String(now.getMinutes()).padStart(2, "0");

let currentDate = document.querySelector("#current-date");
currentDate.innerHTML = `${weekDay}, ${hours}:${minutes}`;

function search(event) {
  event.preventDefault();
  let searchInput = document.querySelector("#search-city-input");

  let cityName = document.querySelector("#city-name");

  if (searchInput.value) {
    cityName.innerHTML = searchInput.value;
  } else {
    alert("Please enter a city");
  }
}