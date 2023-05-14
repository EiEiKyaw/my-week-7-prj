function formatDay(timestamp) {
  let date = new Date(timestamp * 1000);
  let day = date.getDay();
  let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return days[day];
}

function formatDate(timestamp) {
  let date = new Date(timestamp);
  let hours = date.getHours();
  if (hours < 10) {
    hours = `0${hours}`;
  }
  let minutes = date.getMinutes();
  if (minutes < 10) {
    minutes = `0${minutes}`;
  }

  let day = formatDay(timestamp);
  return `${day} ${hours}:${minutes}`;
}

function displayForecast(response) {
  let data = response.data.daily;
  let forecastEle = document.querySelector("#forecast-table");
  let forecastHtml = "";

  data.forEach(function (forecastData, index) {
    let innerText = "";
    let dayVal = formatDay(forecastData.time);
    if (index == 0) {
      dayVal = "Today";
    }
    innerText = `<tr>
                  <div class="row">
                    <div class="col-3 f-day">${dayVal}</div>
                    <div class="col-6 f-desc">
                      <img
                        src="${forecastData.condition.icon_url}"
                        alt="Clear"
                      />${forecastData.condition.description}
                    </div>
                    <div class="col-3 f-temp">
                      <span class="f-max-temp">${Math.round(
                        forecastData.temperature.maximum
                      )}</span>/<span
                        class="f-min-temp"
                        >${Math.round(forecastData.temperature.minimum)}</span
                      >
                    </div>
                  </div>
                </tr><hr />`;
    forecastHtml = forecastHtml + innerText;
  });
  forecastEle.innerHTML = forecastHtml;
}

function getForecastList(cityName) {
  let apiUrl = `https://api.shecodes.io/weather/v1/forecast?query=${cityName}&key=${apiKey}`;
  axios.get(apiUrl).then(displayForecast);
}

function displayCurrentWeather(response) {
  let data = response.data;
  currentTemp = response.data.temperature.current;
  let cityEle = document.querySelector("#city-name");
  let countryEle = document.querySelector("#country-name");
  let dateEle = document.querySelector("#date");
  let descEle = document.querySelector("#description");
  let iconEle = document.querySelector("#weather-icon");
  let humidityEle = document.querySelector("#humidity-value");
  let windEle = document.querySelector("#wind-value");
  let pressureEle = document.querySelector("#pressure-value");
  let feelsEle = document.querySelector("#fl-value");

  cityEle.innerHTML = data.city;
  countryEle.innerHTML = data.country;
  dateEle.innerHTML = formatDate(data.time * 1000);
  descEle.innerHTML = data.condition.description;
  iconEle.setAttribute("src", data.condition.icon_url);
  tempEle.innerHTML = Math.round(currentTemp);
  humidityEle.innerHTML = Math.round(data.temperature.humidity);
  windEle.innerHTML = Math.round(data.wind.speed);
  pressureEle.innerHTML = Math.round(data.temperature.pressure);
  feelsEle.innerHTML = Math.round(data.temperature.feels_like);

  getForecastList(data.city);
}

function searchWeather(cityName) {
  let apiUrl = `https://api.shecodes.io/weather/v1/current?query=${cityName}&key=${apiKey}`;
  axios.get(apiUrl).then(displayCurrentWeather);
}

function processSearching(event) {
  event.preventDefault();
  let searchCity = document.querySelector("#search-city");
  searchWeather(searchCity.value);
}

function convertFahrenheit(event) {
  event.preventDefault();
  celEle.classList.remove("active");
  fahEle.classList.add("active");
  let fahTemp = (currentTemp * 9) / 5 + 32;
  tempEle.innerHTML = Math.round(fahTemp);
}

function convertCelcius(event) {
  event.preventDefault();
  fahEle.classList.remove("active");
  celEle.classList.add("active");
  tempEle.innerHTML = Math.round(currentTemp);
}

function callCurrentPosition(position) {
  let lat = position.coords.latitude;
  let long = position.coords.longitude;
  let apiUrl = `https://api.shecodes.io/weather/v1/current?lon=${long}&lat=${lat}&key=${apiKey}`;
  axios.get(apiUrl).then(displayCurrentWeather);
}

let apiKey = "3tf4404efa0b2d41d89ob6d7a3f07dbc";
let form = document.querySelector("#search-form");
let currentTemp = 0;
let tempEle = document.querySelector("#temperature");
let fahEle = document.querySelector("#fahrenheit-unit");
let celEle = document.querySelector("#celcius-unit");

form.addEventListener("submit", processSearching);

fahEle.addEventListener("click", convertFahrenheit);

celEle.addEventListener("click", convertCelcius);

navigator.geolocation.getCurrentPosition(callCurrentPosition);
