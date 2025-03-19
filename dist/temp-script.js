// DOM Elements
const dailyForecast = document.getElementById("daily-forecast")
const weeklyForecast = document.getElementById("weekly-forecast")


let data = []

//refactor const
// Convert Unix timestamp to readable time
const formatTime = (timestamp) => {
  const date = new Date(timestamp * 1000)
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
}

//Capital first letter function
const capitalFirst = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1)
}



const baseURL = "https://api.openweathermap.org/data/2.5/"
const apiKEY = "dfd2a92cf6c2789182807260f210958f"
const apiURL = `${baseURL}weather?q=Stockholm&units=metric&APPID=${apiKEY}`
let cityName = "Stockholm"

const apiURLForecast = `${baseURL}forecast?q=${cityName}&units=metric&appid=${apiKEY}`

console.log(`${apiURL} works`)
console.log(`${apiURLForecast} works`)


//Generete elements
const fetchWeather = () => {
  fetch(apiURL)
    .then(response => response.json())
    .then((data) => {
      console.log("weather data", data.main.temp)
      dailyForecast.innerHTML = `
      <h1 class="current-temp">${data.main.temp.toFixed(0)} <span>C°</span</h1>
      <h2 class="city">${data.name}</h2>
      <h3 class="weather-description">${capitalFirst(data.weather[0].description)}</h3>
      <h3 class="sunrise">Sunrise ${formatTime(data.sys.sunrise)}</h3>
      <h3 class="sunset">Sunset ${formatTime(data.sys.sunset)}</h3>
      `
    })
}

const fetchForecast = () => {
  fetch(apiURLForecast)
    .then(response => response.json())
    .then((data) => {
      console.log("forecast data", data)
      const forecastList = data.list
      .filter((forecast) => forecast.dt_txt.endsWith("12:00:00"))
      .slice(1, 5)
      console.log(forecastList)
      forecastList.forEach((forecast) => {
        const date = new Date(forecast.dt * 1000)
        const forecastDay = date.toLocaleDateString("en-US", { weekday: "short" })
        weeklyForecast.innerHTML += `
        <li>
        <p>${forecastDay}</p>
        <p>${forecast.weather[0].main}</p>
        <p>${Math.round(forecast.main.temp)}°C</p>
        </li>`
      })
    }
    )
}

fetchWeather()

fetchForecast()



