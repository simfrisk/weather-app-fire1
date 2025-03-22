"use strict";
const baseURL = "https://api.openweathermap.org/data/2.5/";
const apiKEY = "dfd2a92cf6c2789182807260f210958f";
// DOM Elements
const dailyForecast = document.getElementById("daily-forecast");
const cityInput = document.getElementById("city-input");
const searchBtn = document.getElementById("search-btn");
const weeklyForecast = document.getElementById("weekly-forecast");
const forecastIcon = document.getElementById("forecast-icon");
const forecastDiv = document.getElementById("forecast");
const showForecastBtn = document.getElementById("toggle-btn");
const weekBtn = document.getElementById("week-btn");
const body = document.body;
let data = [];
//Convert Unix timestamp to readable time with timezone
const formatTime = (timestamp, timezoneOffset) => {
    const date = new Date((timestamp + timezoneOffset) * 1000);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", timeZone: "UTC" });
};
//Capital first letter function
const capitalFirst = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
};
const weatherIcons = {
    "01d": { description: "clear sky (day)", file: "01d.svg" },
    "01n": { description: "clear sky (night)", file: "01n.svg" },
    "02d": { description: "few clouds (day)", file: "02d.svg" },
    "02n": { description: "few clouds (night)", file: "02n.svg" },
    "03d": { description: "scattered clouds (day)", file: "03d.svg" },
    "03n": { description: "scattered clouds (night)", file: "03n.svg" },
    "04d": { description: "broken clouds (day)", file: "04d.svg" },
    "04n": { description: "broken clouds (night)", file: "04n.svg" },
    "09d": { description: "shower rain (day)", file: "09d.svg" },
    "09n": { description: "shower rain (night)", file: "09n.svg" },
    "10d": { description: "rain (day)", file: "10d.svg" },
    "10n": { description: "rain (night)", file: "10n.svg" },
    "11d": { description: "thunderstorm (day)", file: "11d.svg" },
    "11n": { description: "thunderstorm (night)", file: "11n.svg" },
    "13d": { description: "snow (day)", file: "13d.svg" },
    "13n": { description: "snow (night)", file: "13n.svg" },
    "50d": { description: "mist (day)", file: "50d.svg" },
    "50n": { description: "mist (night)", file: "50n.svg" }
};
const getWeatherDescription = (iconCode) => {
    const weather = weatherIcons[iconCode];
    return weather ? weather.description : "unknown";
};
const fetchWeather = (city = "Stockholm", lat, lon) => {
    let apiURL = "";
    if (lat !== undefined && lon !== undefined) {
        apiURL = `${baseURL}weather?lat=${lat}&lon=${lon}&units=metric&APPID=${apiKEY}`;
    }
    else {
        apiURL = `${baseURL}weather?q=${city}&units=metric&APPID=${apiKEY}`;
    }
    fetch(apiURL)
        .then((response) => {
        if (!response.ok)
            throw new Error("The city was not found!");
        return response.json();
    })
        .then((data) => {
        dayForecast(data);
        updateBackground(Date.now() / 1000, data.sys.sunrise, data.sys.sunset);
    })
        .catch(() => {
        dailyForecast.innerHTML = `<p>Sorry, we have no weather data matching your search, please select another city.</p>`;
    });
};
const dayForecast = (data) => {
    const iconCode = data.weather[0].icon;
    const weather = weatherIcons[iconCode];
    const iconUrl = `./assets/icons/${weather.file}`;
    const description = capitalFirst(data.weather[0].main);
    const timezoneOffset = data.timezone;
    dailyForecast.innerHTML = `
  <div class="top-forecast">
    <h1 class="current-temp">${data.main.temp.toFixed(0)}<sup>°C</sup></h1>
    <h2 class="city">${data.name}</h2>
    <h3 class="weather-description">${description}</h3>
  </div>
  <div id="sun-position" class="sun-position">
    <h3 class="sunrise">Sunrise ${formatTime(data.sys.sunrise, timezoneOffset)}</h3>
    <h3 class="sunset">Sunset ${formatTime(data.sys.sunset, timezoneOffset)}</h3>
  </div>
`;
    forecastIcon.innerHTML = `<img src="${iconUrl}" alt="${description}">`;
};
const fetchForecast = (city = "Stockholm", lat, lon) => {
    let apiURLForecast;
    if (lat !== undefined && lon !== undefined) {
        apiURLForecast = `${baseURL}forecast?lat=${lat}&lon=${lon}&units=metric&APPID=${apiKEY}`;
    }
    else {
        apiURLForecast = `${baseURL}forecast?q=${city}&units=metric&APPID=${apiKEY}`;
    }
    fetch(apiURLForecast)
        .then((response) => {
        if (!response.ok)
            throw new Error("The city was not found!");
        return response.json();
    })
        .then((data) => {
        const timezoneOffset = data.city.timezone;
        const forecastList = data.list
            .filter((forecast) => forecast.dt_txt.endsWith("12:00:00"))
            .slice(0, 4);
        weeklyForecast.innerHTML = "";
        forecastList.forEach((forecast) => {
            const date = new Date(forecast.dt * 1000);
            const forecastDay = date.toLocaleDateString("en-US", { weekday: "short" });
            const iconCode = forecast.weather[0].icon;
            const weather = weatherIcons[iconCode];
            const iconUrl = `./assets/icons/${weather.file}`;
            weeklyForecast.innerHTML += `
          <li>
            <p>${forecastDay}</p>
            <div class="weather-temp">
              <img src="${iconUrl}" alt="${forecast.weather[0].description}">
              <p>${Math.round(forecast.main.temp)}°C</p>
            </div>
          </li>`;
        });
        weeklyForecast.style.display = "none";
        weeklyForecast.classList.add("toggle-forecast-hide");
    })
        .catch((error) => {
        weeklyForecast.innerHTML = `<p>${error.message}</p>`;
    });
};
const getLocation = () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition, showError);
    }
    else {
        alert("Geolocation is not supported by this browser.");
        fetchWeather();
        fetchForecast();
    }
};
const showPosition = (position) => {
    const lat = position.coords.latitude;
    const lon = position.coords.longitude;
    fetchWeather(undefined, lat, lon);
    fetchForecast(undefined, lat, lon);
};
const showError = (error) => {
    switch (error.code) {
        case error.PERMISSION_DENIED:
            alert("User denied the request for Geolocation.");
            break;
        case error.POSITION_UNAVAILABLE:
            alert("Location information is unavailable.");
            break;
        case error.TIMEOUT:
            alert("The request to get user location timed out.");
            break;
    }
    fetchWeather();
    fetchForecast();
};
searchBtn.addEventListener("click", () => {
    const city = cityInput === null || cityInput === void 0 ? void 0 : cityInput.value.trim();
    if (city) {
        fetchWeather(city);
        fetchForecast(city);
    }
    else {
        alert("Try again with a valid city");
    }
});
getLocation();
const updateBackground = (currentTime, sunrise, sunset) => {
    if (currentTime >= sunrise && currentTime < sunset) {
        body.classList.remove("night");
    }
    else {
        body.classList.add("night");
    }
};
showForecastBtn.addEventListener("click", () => {
    showForecastBtn.disabled = true;
    const sunPosition = document.getElementById("sun-position");
    if (!weeklyForecast.classList.contains("toggle-forecast-show")) {
        weeklyForecast.style.display = "block";
        setTimeout(() => {
            forecastDiv.classList.add("compact");
            sunPosition.classList.add("compact-sun");
            weeklyForecast.classList.add("toggle-forecast-show");
            weekBtn.classList.remove("slow");
            weekBtn.classList.add("btn-shift");
        }, 5);
        setTimeout(() => {
            showForecastBtn.textContent = "▼";
            showForecastBtn.disabled = false;
        }, 600);
    }
    else {
        weeklyForecast.classList.remove("toggle-forecast-show");
        forecastDiv.classList.remove("compact");
        sunPosition.classList.remove("compact-sun");
        weekBtn.classList.add("slow");
        weekBtn.classList.remove("btn-shift");
        setTimeout(() => {
            weeklyForecast.style.display = "none";
        }, 300);
        setTimeout(() => {
            showForecastBtn.textContent = "▲";
            showForecastBtn.disabled = false;
        }, 300);
    }
});
