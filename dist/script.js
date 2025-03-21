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
const body = document.body;
let data = [];

// Show loader when the page is loading
document.addEventListener("DOMContentLoaded", function() {
  document.body.classList.add('loading');
});

// Hide loader when the page has finished loading
window.addEventListener("load", function() {
  document.body.classList.remove('loading');
});

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
