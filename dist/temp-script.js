// DOM Elements
const dailyForecast = document.getElementById("daily-forecast")
const cityInput = document.getElementById("city-input")
const searchBtn = document.getElementById("search-btn")
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


const fetchWeather = (city = "Stockholm") => {
  const apiURL = `${baseURL}weather?q=${city}&units=metric&APPID=${apiKEY}`

  fetch(apiURL)
    .then((response) => {
      if (!response.ok) {
        throw new Error("The city was not found!")
      }
      return response.json()
    })
    .then((data) => {
      console.log("weather data", data.main.temp)
      dailyForecast.innerHTML = `
      <h1 class="current-temp">${data.main.temp.toFixed(0)} <span>C°</span</h1>
      <h2 class="city">${data.name}</h2>
      <h3 class="weather-description">${capitalFirst(data.weather[0].main)}</h3>
      <div class="sun-position">
      <h3 class="sunrise">Sunrise ${formatTime(data.sys.sunrise)}</h3>
      <h3 class="sunset">Sunset ${formatTime(data.sys.sunset)}</h3>
      </div>
      <button id="toggle-btn">Show Forecast</button>
      `
      const ShowForecastBtn = document.getElementById("toggle-btn")
      ShowForecastBtn.addEventListener("click", () => {
        weeklyForecast.style.display = weeklyForecast.style.display === "none" ? "block" : "none"
        ShowForecastBtn.textContent = weeklyForecast.style.display === "none" ? "Show Forecast" : "Hide Forecast" //We might want to change this to some kind of arrow animation?
      })
    })
    .catch(() => {
      dailyForecast.innerHTML = `<p>Sorry, we have no weather data matching your search, please select another city.</p>`
    })
}

const fetchForecast = (city = "Stockholm") => {
  const apiURLForecast = `${baseURL}forecast?q=${city}&units=metric&appid=${apiKEY}`
  fetch(apiURLForecast)
    .then((response) => {
      if (!response.ok) {
        throw new Error("The city was not found!")
      }
      return response.json()
    })
    .then((data) => {
      const forecastList = data.list
        .filter((forecast) => forecast.dt_txt.endsWith("12:00:00"))
        .slice(1, 5)
      weeklyForecast.innerHTML = ""
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
      weeklyForecast.style.display = "none"
    })
    .catch((error) => {
      weeklyForecast.innerHTML = `<p>${error.message}</p>`
    })
}

// Event listener for search button
searchBtn.addEventListener("click", () => {
  const city = cityInput.value.trim()
  if (city) {
    fetchWeather(city)
    fetchForecast(city)
  } else {
    alert("Try again with a valid city")
  }
})

// Fetch weather with Stockholm as start position
fetchWeather()
fetchForecast()