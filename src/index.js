//Global Variables
let apiKey = "f3t5b36ab43852690f35359144ebo9d6";
let units = "metric";

let currentTempHTML = document.querySelector("#current-temp-num");
let fahrenheitHTML = document.querySelector("#fahrenheit");
let celsiusHTML = document.querySelector("#celsius");

let currentTypeTemp = "celsius";
let currentTemp;

let city;

let showCityElement = document.querySelector("#search-city");

let currentLocationBtn = document.querySelector("#current-location-button");

function convertToFahrenheit(celsius) {
  let fahrenheit = (celsius * 9) / 5 + 32;
  return fahrenheit;
}
    
function convertToCelsius(fahrenheit) {
  let celsius = ((fahrenheit - 32) * 5) / 9;
  return celsius;
}

function temperatureConversion(temperatureType) {
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

function setupCityInfo (data) {
  //retrieve city
  let currentLocation = data.data.city;
  let currentLocationHTML = document.querySelector("#city-name");
  currentLocationHTML.innerHTML = currentLocation;

  //retrieve temperature
  currentTemp = Math.round(data.data.temperature.current);
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

  let iconElement = document.querySelector("#icon-current");
  iconElement.setAttribute("src",`http://shecodes-assets.s3.amazonaws.com/api/weather/icons/${data.data.condition.icon}.png`);

  let currentConditionElement = document.querySelector("#current-condition");
  currentConditionElement.innerHTML = data.data.condition.description;

  let humidityElement = document.querySelector("#humidity");
  humidityElement.innerHTML = data.data.temperature.humidity;

  let windElement = document.querySelector("#wind");
  windElement.innerHTML = data.data.wind.speed;

}

function resetTempType() {
  currentTypeTemp = "celsius";
  celsiusHTML.classList.add("selectedTemperature");
  fahrenheitHTML.classList.remove("selectedTemperature");
}

// Code to get the API information about current location
function getCurrentLocation() {
  resetTempType();
  navigator.geolocation.getCurrentPosition((position) => {
    let lat = position.coords.latitude;
    let lon = position.coords.longitude;
    let apiUrl = `https://api.shecodes.io/weather/v1/current?lon=${lon}&lat=${lat}&key=${apiKey}&units=${units}`; 
    axios.get(apiUrl).then((data) => {
      console.log('data-current-location', data);
      setupCityInfo(data);
    }).catch((error) => {
      console.log("error", error);
    });
  });
  
}
currentLocationBtn.addEventListener("click", getCurrentLocation);


// Code to get the API information about searched city
function searchCity(cityInput) {
  let apiUrlCity = `https://api.shecodes.io/weather/v1/current?query=${cityInput}&key=${apiKey}&units=${units}`;
  axios.get(apiUrlCity).then((data) => {
    console.log('data', data);
    setupCityInfo(data);
  }, (error) => {
    alert("City does not exist. Please submit a valid city.");
    let cityInput = document.querySelector("#search-city-input");
    cityInput.value = "";
    console.log("error", error);
  });
}

showCityElement.addEventListener("submit", function(event) {
  event.preventDefault();
  resetTempType();
  let cityInput = document.querySelector("#search-city-input").value;
  city = cityInput;
  if (!cityInput) {
    alert("Please enter a City!");
  } else {
  searchCity(cityInput);
  }
});

//init
getCurrentLocation();


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

let backgroundElement = document.querySelector("container");

if (hours >= 8 && hours <19) {
  backgroundElement.classList.add("container-day");
} else {
  backgroundElement.classList.add("container-night");
}