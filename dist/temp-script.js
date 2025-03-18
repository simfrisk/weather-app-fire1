// DOM Elements
const dailyForecast = document.getElementById("daily-forecast");

//Fetch API

//Base URL
//Key
//Cordinates


const baseURL = "https://api.openweathermap.org/data/2.5/"
const apiKEY = "dfd2a92cf6c2789182807260f210958f"
const apiURL = `${baseURL}weather?q=Stockholm&units=metric&APPID=${apiKEY}`

console.log(`${apiURL} works`)


//Generete elements
const fetchWeather = () => {
  fetch(apiURL)
    .then(response => response.json())
    .then((data) => {
      console.log("weather data", data.main.temp)
      dailyForecast.innerHTML = `
      <h1 class="current-temp">${data.main.temp}</h1>
      <h2 class="city">${data.name}</h2>
      <h3 class="weather-description">${data.weather[0].description}</h3>
      <h3 class="sunrise">${data.sys.sunrise}</h3>
      <h3 class="sunset">${data.sys.sunset}</h3>
      `
    })
}

fetchWeather()



