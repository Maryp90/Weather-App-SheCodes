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

//Code to change the background image taking into consideration the hours
let now = new Date();

let hours = String(now.getHours()).padStart(2, "0");
let minutes = String(now.getMinutes()).padStart(2, "0");

let containerElement = document.querySelector("#container");

if (hours >= 8 && hours <20) {
  containerElement.style.backgroundImage = "container";
} else {
  containerElement.style.backgroundImage = "linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.2)), url('https://s3.amazonaws.com/shecodesio-production/uploads/files/000/086/173/original/ezgif.com-crop_%282%29.jpg?1687041125')";
}


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
    fahrenheitHTML.classList.add("selectedTemperature");
    celsiusHTML.classList.remove("selectedTemperature");
    units = "imperial";
    searchCity(city);
    console.log("city", city);
  } else if (temperatureType === "celsius" && currentTypeTemp !== "celsius") {
    currentTempHTML.innerHTML = Math.round(convertToCelsius(currentTemp));
    celsiusHTML.classList.add("selectedTemperature");
    fahrenheitHTML.classList.remove("selectedTemperature");
    units = "metric";
    searchCity(city);
  }
  currentTypeTemp = temperatureType;
}

function formatDay(timestamp) {
  let date = new Date(timestamp * 1000);
  let day = date.getDay();
  let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return days[day];
}

function displayForecast(response) {
  let forecast = response.data.daily;
  let forecastElement = document.querySelector("#forecast");

  let forecastHTML = `<div class="row">`;
  forecast.forEach(function(forecastDay, index) {
    if(index > 0 && index < 7) {
    forecastHTML = forecastHTML + `
    <div class="col-2">
      <div class="weather-forecast-date">${formatDay(forecastDay.time)}</div>
      <img src="http://shecodes-assets.s3.amazonaws.com/api/weather/icons/${forecastDay.condition.icon}.png" alt="" class="forecast-image"/>
      <div class="weather-forescat-temp">
        <span class="weather-forecast-temp-max">${Math.round(forecastDay.temperature.maximum)}º</span>
        <span class="weather-forecast-temp-min">${Math.round(forecastDay.temperature.minimum)}º</span>
      </div>
    </div>`;
  }
  })
  forecastHTML = forecastHTML + `</div>`;
  forecastElement.innerHTML = forecastHTML;
}


function getForecast(coordinates) {
  console.log('coordinates', coordinates);
  let apiUrlForecast = `https://api.shecodes.io/weather/v1/forecast?lon=${coordinates.longitude}&lat=${coordinates.latitude}&key=${apiKey}&units=${units}`;
  console.log(apiUrlForecast);
  axios.get(apiUrlForecast).then(displayForecast);
}

function setupCityInfo(response) {
  //retrieve city
  let currentLocation = response.data.city;
  let currentLocationHTML = document.querySelector("#city-name");
  currentLocationHTML.innerHTML = currentLocation;

  //retrieve temperature
  currentTemp = Math.round(response.data.temperature.current);
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
  iconElement.setAttribute("src",`http://shecodes-assets.s3.amazonaws.com/api/weather/icons/${response.data.condition.icon}.png`);

  let currentConditionElement = document.querySelector("#current-condition");
  currentConditionElement.innerHTML = response.data.condition.description;

  let humidityElement = document.querySelector("#humidity");
  humidityElement.innerHTML = response.data.temperature.humidity;

  let windElement = document.querySelector("#wind");
  windElement.innerHTML = response.data.wind.speed;

  getForecast(response.data.coordinates);
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
      city = data.data.city;
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
  axios.get(apiUrlCity)
  .then((data) => {
    //console.log('data', data);
    setupCityInfo(data);
  })
  .catch((error) => {
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