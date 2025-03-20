const baseURL: string = "https://api.openweathermap.org/data/2.5/"
const apiKEY: string = "dfd2a92cf6c2789182807260f210958f"

// DOM Elements
const dailyForecast = document.getElementById("daily-forecast") as HTMLElement | null
const cityInput = document.getElementById("city-input") as HTMLElement | null
const searchBtn = document.getElementById("search-btn") as HTMLElement | null
const weeklyForecast = document.getElementById("weekly-forecast") as HTMLElement | null
const forecastIcon = document.getElementById("forecast-icon") as HTMLElement | null
const forecastDiv = document.getElementById("forecast") as HTMLElement | null
const body = document.body as HTMLBodyElement | null

let data: any[] = []

//Convert Unix timestamp to readable time with timezone
const formatTime = (timestamp: number, timezoneOffset: number): string => {
  const date = new Date((timestamp + timezoneOffset) * 1000);
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", timeZone: "UTC" });
};

//Capital first letter function
const capitalFirst = (string: string): string => {
    return string.charAt(0).toUpperCase() + string.slice(1)
  }

  