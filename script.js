// API Key (Sign up at OpenWeatherMap to get yours)
const API_KEY = "6e2ee34c0da06f8315ff46d377edc987";

// DOM Elements
const cityInput = document.getElementById("city-input");
const searchBtn = document.getElementById("search-btn");
const cityName = document.getElementById("city-name");
const currentTemp = document.getElementById("current-temp");
const weatherDesc = document.getElementById("weather-desc");
const humidity = document.getElementById("humidity");
const windSpeed = document.getElementById("wind-speed");
const weatherIcon = document.getElementById("weather-icon");
const forecastContainer = document.getElementById("forecast-container");

// Default city on load
fetchWeather("London");

// Search button event
searchBtn.addEventListener("click", () => {
    const city = cityInput.value.trim();
    if (city) fetchWeather(city);
});

// Fetch current weather & forecast
async function fetchWeather(city) {
    try {
        // Fetch current weather
        const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${API_KEY}`;
        const currentResponse = await fetch(currentWeatherUrl);
        if (!currentResponse.ok) throw new Error("City not found!");
        const currentData = await currentResponse.json();

        // Fetch 5-day forecast
        const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${API_KEY}`;
        const forecastResponse = await fetch(forecastUrl);
        const forecastData = await forecastResponse.json();

        // Update UI
        updateCurrentWeather(currentData);
        updateForecast(forecastData);
    } catch (error) {
        alert(error.message);
    }
}

// Update current weather UI
function updateCurrentWeather(data) {
    cityName.textContent = data.name;
    currentTemp.textContent = `${Math.round(data.main.temp)}°C`;
    weatherDesc.textContent = data.weather[0].description;
    humidity.textContent = `${data.main.humidity}%`;
    windSpeed.textContent = `${data.wind.speed} km/h`;
    weatherIcon.src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
}

// Update 5-day forecast
function updateForecast(data) {
    forecastContainer.innerHTML = ""; // Clear previous forecast

    // Filter to get one entry per day (API returns every 3 hours)
    const dailyForecast = data.list.filter((item, index) => index % 8 === 0);

    dailyForecast.slice(0, 5).forEach(day => {
        const date = new Date(day.dt * 1000).toLocaleDateString("en-US", { weekday: "short" });
        const forecastItem = document.createElement("div");
        forecastItem.className = "forecast-item";
        forecastItem.innerHTML = `
            <p><strong>${date}</strong></p>
            <img src="https://openweathermap.org/img/wn/${day.weather[0].icon}.png" alt="${day.weather[0].description}">
            <p>${Math.round(day.main.temp_max)}°C / ${Math.round(day.main.temp_min)}°C</p>
        `;
        forecastContainer.appendChild(forecastItem);
    });
}