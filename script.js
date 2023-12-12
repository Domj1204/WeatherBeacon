document.addEventListener('DOMContentLoaded', () => {
const resetButton = document.querySelector(".reset-button");
const cityInput = document.querySelector(".city-input");
const searchButton = document.querySelector(".search-btn");
const weatherCardsContainer = document.querySelector(".weather-cards");
const currentWeatherContainer = document.querySelector(".current-weather .details");
const cityListContainer = document.querySelector(".city-list"); // Ensure you have this element in your HTML
const API_KEY = "041a690bde7ca47228fe2d249f922896"; // Replace with your actual API key
let searchedCities = JSON.parse(localStorage.getItem("searchedCities")) || [];

const displaySearchedCities = () => {
  cityListContainer.innerHTML = searchedCities
    .map(city => `<button class="city-name">${city}</button>`)
    .join('');
  cityListContainer.querySelectorAll('.city-name').forEach(cityButton => {
    cityButton.addEventListener('click', () => {
      getCityWeather(cityButton.textContent);
    });
  });
};

const getCityWeather = (cityName) => {
  const FORECAST_API_URL = `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&units=imperial&appid=${API_KEY}`;
  const CURRENT_WEATHER_API_URL = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=imperial&appid=${API_KEY}`;
  
  fetch(CURRENT_WEATHER_API_URL)
    .then(response => response.json())
    .then(data => {
      const weatherHTML = `
        <h2>${data.name} (${new Date(data.dt * 1000).toLocaleDateString()})</h2>
        <h4>Temperature: ${data.main.temp.toFixed(2)}°F</h4>
        <h4>Wind: ${data.wind.speed.toFixed(2)} M/S</h4>
        <h4>Humidity: ${data.main.humidity}%</h4>
      `;
      currentWeatherContainer.innerHTML = weatherHTML;
    })
    .catch(error => {
      alert("An error occurred while fetching the current weather data!");
      console.error(error);
    });

  fetch(FORECAST_API_URL)
    .then(response => response.json())
    .then(data => {
      updateForecastDisplay(data);
    })
    .catch(error => {
      alert("An error occurred while fetching the forecast data!");
      console.error(error);
    });
  
  if (!searchedCities.includes(cityName)) {
    searchedCities.push(cityName);
    localStorage.setItem("searchedCities", JSON.stringify(searchedCities));
    displaySearchedCities();
  }
};

searchButton.addEventListener("click", () => {
  const cityName = cityInput.value.trim();
  if (cityName) {
    getCityWeather(cityName);
  }
});

resetButton.addEventListener("click", () => {
    searchedCities = []; // Clear the array
    localStorage.removeItem("searchedCities"); // Remove from local storage
    displaySearchedCities(); // Update the display
});

const updateForecastDisplay = (forecastData) => {
  weatherCardsContainer.innerHTML = '';

  for (let i = 0; i < forecastData.list.length; i += 8) {
    const dayData = forecastData.list[i];
    const dayCardHTML = `
      <li class="card">
        <h2>${new Date(dayData.dt_txt).toLocaleDateString()}</h2>
        <img src="https://openweathermap.org/img/wn/${dayData.weather[0].icon}@2x.png" alt="weather-icon">
        <h4>Temperature: ${dayData.main.temp.toFixed(2)}°F</h4>
        <h4>Wind: ${dayData.wind.speed.toFixed(2)} M/S</h4>
        <h4>Humidity: ${dayData.main.humidity}%</h4>
      </li>
    `;
    weatherCardsContainer.innerHTML += dayCardHTML;
  }
};

displaySearchedCities();
});