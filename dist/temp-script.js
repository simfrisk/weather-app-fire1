// DOM Elements
const dailyForecast = document.getElementById("daily-forecast");
const cityInput = document.getElementById("city-input");
const searchBtn = document.getElementById("search-btn");

//Fetch API

//Base URL
//Key
//Cordinates

const baseURL = "https://api.openweathermap.org/data/2.5/";
const apiKEY = "dfd2a92cf6c2789182807260f210958f";
// const apiURL = `${baseURL}weather?q=Stockholm&units=metric&APPID=${apiKEY}`;

//Generete elements

//Search function

const fetchWeather = (city = "Stockholm") => {
  const apiURL = `${baseURL}weather?q=${city}&units=metric&APPID=${apiKEY}`;

  console.log(`${apiURL} works`);

  fetch(apiURL)
    .then((response) => {
      if (!response.ok) {
        throw new Error("The city was not found!");
      }
      return response.json();
    })
    .then((data) => {
      console.log("weather data", data.main.temp);

      const { temp } = data.main;
      const { name: cityName } = data;
      const { description } = data.weather[0];
      const timezoneOffset = data.timezone;
      const sunrise = new Date(
        (data.sys.sunrise + timezoneOffset) * 1000
      ).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
      const sunset = new Date(
        (data.sys.sunset + timezoneOffset) * 1000
      ).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

      dailyForecast.innerHTML = `
        <h1 class="current-temp">${temp}°C</h1>
        <h2 class="city">${cityName}</h2>
        <h3 class="weather-description">${description}</h3>
        <h3 class="sunrise">Sunrise: ${sunrise}</h3>
        <h3 class="sunset">Sunset: ${sunset}</h3>
      `;
    })
    .catch((error) => {
      dailyForecast.innerHTML = `<p>${error.message}</p>`;
    });
};

// Event listener for search button
searchBtn.addEventListener("click", () => {
  const city = cityInput.value.trim();
  if (city) {
    fetchWeather(city);
  } else {
    alert("Try again with a valid city");
  }
});

// Fetch weather with Stockholm as start position
fetchWeather();
