const apiKey = "347a03dddcfceab3edacbd83b8b25864";

function getCityCoordinates(city) {
    return fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`)
        .then(response => response.json())
        .then(data => {
            return {
                lat: data.coord.lat,
                lon: data.coord.lon
            };
        });
}

function getWeatherData(coordinates) {
    return fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${apiKey}&units=metric`)
        .then(response => response.json());
}

function updateUI(weatherData) {
    const currentWeather = weatherData.list[0];
    const forecast = weatherData.list.slice(1, 6);

    const currentWeatherHTML = `
        <h2 >${weatherData.city.name} (${new Date(currentWeather.dt * 1000).toLocaleDateString()})</h2>
        <img src="http://openweathermap.org/img/wn/${currentWeather.weather[0].icon}.png" alt="${currentWeather.weather[0].description}" class="card-img">
        <p class="card-text">Temperature: ${currentWeather.main.temp}°C</p>
        <p class="card-text">Humidity: ${currentWeather.main.humidity}%</p>
        <p class="card-text">Wind Speed: ${currentWeather.wind.speed} m/s</p>
    `;

    document.getElementById("current-weather").innerHTML = currentWeatherHTML;

    const forecastHTML = forecast.map(day => `
        <div class="forecast-day">
            <h3 class="card-title">${new Date(day.dt * 1000).toLocaleDateString()}</h3>
            <img src="http://openweathermap.org/img/wn/${day.weather[0].icon}.png" alt="${day.weather[0].description}" class="card-img">
            <p class="card-text">Temperature: ${day.main.temp}°C</p>
            <p class="card-text">Wind Speed: ${day.wind.speed} m/s</p>
            <p class="card-text">Humidity: ${day.main.humidity}%</p>
        </div>
    `).join("");

    document.getElementById("forecast").innerHTML = forecastHTML;
}

function saveSearchHistory(city) {
    let searchHistory = JSON.parse(localStorage.getItem("searchHistory")) || [];
    if (!searchHistory.includes(city)) {
        searchHistory.unshift(city);
        searchHistory = searchHistory.slice(0, 10); // Limit to 10 cities
        localStorage.setItem("searchHistory", JSON.stringify(searchHistory));
    }
    loadSearchHistory();
}

function loadSearchHistory() {
    const searchHistory = JSON.parse(localStorage.getItem("searchHistory")) || [];
    const searchHistoryHTML = searchHistory.map(city => `<button class="search-history-btn">${city}</button>`).join("");
    document.getElementById("search-history").innerHTML = searchHistoryHTML;
}
 
function clearSearchHistory() {
    localStorage.removeItem("searchHistory");
    document.getElementById("search-history").innerHTML = "";
}

document.getElementById("clear-history").addEventListener("click", clearSearchHistory);

document.getElementById("search-button").addEventListener("click", () => {
    const city = document.getElementById("city-search").value;
    getCityCoordinates(city).then(coordinates => {
        getWeatherData(coordinates).then(weatherData => {
            updateUI(weatherData);
            saveSearchHistory(city);
        });
    });
});

document.getElementById("search-history").addEventListener("click", (event) => {
    if (event.target.tagName === "BUTTON") {
        const city = event.target.textContent;
        getCityCoordinates(city).then(coordinates => {
            getWeatherData(coordinates).then(weatherData => {
                updateUI(weatherData);
            });
            });
            }
            });
            
            loadSearchHistory();
