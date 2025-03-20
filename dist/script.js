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
//Convert Unix timestamp to readable time with timezone
const formatTime = (timestamp, timezoneOffset) => {
    const date = new Date((timestamp + timezoneOffset) * 1000);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", timeZone: "UTC" });
};
//Capital first letter function
const capitalFirst = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
};
