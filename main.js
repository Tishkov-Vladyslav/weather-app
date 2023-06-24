
const app = document.querySelector('.weather-app');
const temp = document.querySelector('.temp');
const dateOutput = document.querySelector('.date');
const timeOutput = document.querySelector('.time');
const conditionOutput = document.querySelector('.condition');
const nameOutput = document.querySelector('.name');
const icon = document.querySelector('.icon');
const bnt = document.getElementById('btn');
const cloudOutput = document.querySelector('.cloud');
const humidityOutput = document.querySelector('.humidity');
const windOutput = document.querySelector('.wind');
const form = document.getElementById('locationInput');
const search = document.querySelector('.search');
const cities = document.querySelectorAll('.city');
const unitToggleF = document.querySelector('.unit-F');
const unitToggleC = document.querySelector('.unit-C');
const todayButton = document.querySelector('.today-button');
const threeDayButton = document.querySelector('.three-day-button');
const sevenDayButton = document.querySelector('.seven-day-button');
const apiKey = 'b6ebbd7f40394af0893114308232106';

let isFahrenheit = false;

let selectedCity = "";
// Отримує поточні дані про погоду для вказаного міста
function fetchWeatherData(city) {
    const url = `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${city}`;
    fetch(url)
        .then(response => response.json())
        .then(data => {
            console.log(data);
            if (isFahrenheit) {
                temp.innerHTML = data.current.temp_f.toFixed(1) + "&#176;F";
            } else {
                temp.innerHTML = data.current.temp_c.toFixed(1) + "&#176;C";
            }
            temp.dataset.celsius = data.current.temp_c.toFixed(1);
            temp.dataset.fahrenheit = data.current.temp_f.toFixed(1);
            updateTemperature();
            conditionOutput.innerHTML = data.current.condition.text;
            const date = data.location.localtime;
            const y = parseInt(date.substr(0, 4));
            const m = parseInt(date.substr(5, 2));
            const d = parseInt(date.substr(8, 2));
            const time = date.substr(11);
            dateOutput.innerHTML = `${dayOfTheWeek(d, m, y)}  ${d}, ${m}, ${y}`
            timeOutput.innerHTML = time;
            nameOutput.innerHTML = data.location.name;
            const iconId = data.current.condition.icon.substr("//cdn.weatherapi.com/weather/64x64/".length);
            icon.src = "./icons/" + iconId;
            cloudOutput.innerHTML = data.current.cloud + "%";
            humidityOutput.innerHTML = data.current.humidity + "%";
            windOutput.innerHTML = data.current.wind_kph + "km/h";
            let timeOfDay = data.current.is_day ? "day" : "night";
            const code = data.current.condition.code;
            if (code == 1000) {
                app.style.backgroundImage = `url(./images/${timeOfDay}/clearsky.avif)`;
                btn.style.background = "#e5ba92";
            } else if (
                code == 1003 ||
                code == 1006 ||
                code == 1009 ||
                code == 1030 ||
                code == 1069 ||
                code == 1087 ||
                code == 1135 ||
                code == 1273 ||
                code == 1276 ||
                code == 1279 ||
                code == 1282
            ) {
                app.style.backgroundImage = `url(./images/${timeOfDay}/cloudy.avif)`;
                btn.style.background = "#fa6d1b";
            } else if (
                code == 1063 ||
                code == 1069 ||
                code == 1072 ||
                code == 1150 ||
                code == 1153 ||
                code == 1180 ||
                code == 1083 ||
                code == 1086 ||
                code == 1183 ||
                code == 1189 ||
                code == 1192 ||
                code == 1195 ||
                code == 1204 ||
                code == 1207 ||
                code == 1240 ||
                code == 1243 ||
                code == 1246 ||
                code == 1249 ||
                code == 1252
            ) {
                app.style.backgroundImage = `url(./images/${timeOfDay}/rain.avif)`;
                btn.style.background = "#647d75";
            } else {
                app.style.backgroundImage = `url(./images/${timeOfDay}/snow.avif)`;
                btn.style.background = "#4d72aa";
            }

            if (timeOfDay == "night") {
                btn.style.background = "#181e27";
                app.style.backgroundImage = `url(./images/${timeOfDay}/clearsky.avif)`;
            }

            app.style.opacity = "1";
        })
        .catch(error => {
            console.log('Error:', error);
        });
}

let isHourlyWeatherVisible = false;
//обробник для країн які є у списку вибору
cities.forEach(city => {
    city.addEventListener('click', (e) => {
        selectedCity = e.target.innerHTML;
        app.style.opacity = "1";
        fetchWeatherData(selectedCity);
        todayButton.addEventListener('click', () => {
            const weatherDetails = document.querySelector('.weather-details');
            if (isHourlyWeatherVisible) {
                weatherDetails.style.display = 'none';
                isHourlyWeatherVisible = false;
            } else {
                weatherDetails.style.display = 'block';
                isHourlyWeatherVisible = true;
                fetchHourlyWeather(selectedCity);
            }
        });
        threeDayButton.addEventListener('click', () => {
            const threeweatherdeatails = document.querySelector('.three-weather-details');
            if (isThreeDayWeatherVisible) {
                threeweatherdeatails.style.display = 'none';
                isThreeDayWeatherVisible = false;
            } else {
                threeweatherdeatails.style.display = 'flex';
                isThreeDayWeatherVisible = true;
                fetchThreeDayForecast(selectedCity);
            }
        });
        sevenDayButton.addEventListener('click', () => {
            const sevenWeatherDetails = document.querySelector('.seven-weather-details');
            if (isSevenDayWeatherVisible) {
                sevenWeatherDetails.style.display = 'none';
                isSevenDayWeatherVisible = false;
            } else {
                sevenWeatherDetails.style.display = 'flex';
                isSevenDayWeatherVisible = true;
                fetchSevenDayForecast(selectedCity);
            }
        });
        const hideButton = document.querySelector('.hide-button');
        hideButton.addEventListener('click', () => {
        const weatherDetails = document.querySelector('.weather-details');
        const threeWeatherDetails = document.querySelector('.three-weather-details');
        const sevenWeatherDetails = document.querySelector('.seven-weather-details');
        weatherDetails.style.display = 'none';
        threeWeatherDetails.style.display = 'none';
        sevenWeatherDetails.style.display = 'none';
        });
    });
});
// обробник для введення міста для подальшого прогнозу погоди
form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (search.value.length == 0) {
        alert('Please type in a city name');
    } else {
        selectedCity = search.value.trim();
        fetchWeatherData(selectedCity);
        search.value = "";
        app.style.opacity = "1";
    }

});
// Повертає день тижня для вказаної дати
function dayOfTheWeek(day, month, year) {
    const weekday = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday"
    ];
    return weekday[new Date(`${month}/${day}/${year}`).getDay()];
}


// обробник подій для виведення температури в фаренгейтах
unitToggleF.addEventListener('click', () => {
    isFahrenheit = true;
    unitToggleF.classList.add('active');
    unitToggleC.classList.remove('active');
    fetchWeatherData(selectedCity);
    fetchHourlyWeather(selectedCity);
    fetchThreeDayForecast(selectedCity);
    fetchSevenDayForecast(selectedCity);
});
// обробник подій для виведення температури в цельсіях
unitToggleC.addEventListener('click', () => {
    isFahrenheit = false;
    unitToggleC.classList.add('active');
    unitToggleF.classList.remove('active');
    fetchWeatherData(selectedCity);
    fetchHourlyWeather(selectedCity);
    fetchThreeDayForecast(selectedCity);
    fetchSevenDayForecast(selectedCity);
});
// Оновлює відображення температури залежно від обраної одиниці виміру (Фаренгейт або Цельсій)
function updateTemperature() {
    if (isFahrenheit) {
        temp.innerHTML = temp.dataset.fahrenheit + "&#176;F";
    } else {
        temp.innerHTML = temp.dataset.celsius + "&#176;C";
    }
}


//Отримує прогноз погоди на години для вказаного міста
function fetchHourlyWeather(city) {
    const url = `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${city}&days=1&aqi=no&alerts=no`;
    fetch(url)
        .then(response => response.json())
        .then(data => {
            console.log(data);
            const forecast = data.forecast;
            if (forecast && forecast.forecastday && forecast.forecastday.length > 0) {
                const hourlyForecast = forecast.forecastday[0].hour;
                const weatherDetails = document.querySelector('.weather-details');
                weatherDetails.innerHTML = '';
                hourlyForecast.forEach(hour => {
                    const time = hour.time.slice(11, 16);
                    const iconUrl = hour.condition.icon;
                    const temperature = isFahrenheit ? hour.temp_f : hour.temp_c;
                    const weatherItem = document.createElement('li');
                    const iconId = iconUrl.substr("//cdn.weatherapi.com/weather/64x64/".length);
                    const iconPath = `./icons/${iconId}`;
                    weatherItem.innerHTML =
                        `
                        <img src="${iconPath}" alt="Weather Icon" class="hourly-icon">
                        <span class="hourly-time">${time}</span>
                        <span class="hourly-temp">${temperature}${isFahrenheit ? "&#176;F" : "&#176;C"}</span>
                    `;
                    weatherDetails.appendChild(weatherItem);
                });
            } else {
                console.log('No hourly forecast data available.');
            }
        })
        .catch(error => {
            console.log('Error:', error);
        });
}
let isThreeDayWeatherVisible = false;

// Отримує трьохденний прогноз погоди для вказаного міста
function fetchThreeDayForecast(city) {
    const url = `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${city}&days=3&aqi=no&alerts=no`;
    fetch(url)
        .then(response => response.json())
        .then(data => {
            console.log(data);
            const forecastDays = data.forecast.forecastday;
            const threeweatherdeatails = document.querySelector('.three-weather-details');
            threeweatherdeatails.innerHTML = '';

            forecastDays.forEach(forecastDay => {
                const date = forecastDay.date;
                const dayOfWeek = dayOfTheWeek(parseInt(date.substr(8, 2)), parseInt(date.substr(5, 2)), parseInt(date.substr(0, 4)));
                const iconUrl = forecastDay.day.condition.icon;
                const maxTemp = isFahrenheit ? forecastDay.day.maxtemp_f : forecastDay.day.maxtemp_c;
                const minTemp = isFahrenheit ? forecastDay.day.mintemp_f : forecastDay.day.mintemp_c;

                const forecastItem = document.createElement('div');
                const iconId = iconUrl.substr("//cdn.weatherapi.com/weather/64x64/".length);
                const iconPath = `./icons/${iconId}`;
                forecastItem.innerHTML =
                    `
                    <div class="forecast-date">${dayOfWeek}</div>
                    <img src="${iconPath}" alt="Weather Icon" class="forecast-icon">
                    <div class="forecast-temp">
                        <span class="max-temp">${maxTemp}${isFahrenheit ? "&#176;F" : "&#176;C"}</span>
                        <span class="min-temp">${minTemp}${isFahrenheit ? "&#176;F" : "&#176;C"}</span>
                    </div>
                `;
                threeweatherdeatails.appendChild(forecastItem);
            });
        })
        .catch(error => {
            console.log('Error:', error);
        });
}

let isSevenDayWeatherVisible = false;

// Отримує семиденний прогноз погоди для вказаного міста
function fetchSevenDayForecast(city) {
    const url = `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${city}&days=7&aqi=no&alerts=no`;
    fetch(url)
        .then(response => response.json())
        .then(data => {
            console.log(data);
            const forecastDays = data.forecast.forecastday;
            const sevenWeatherDetails = document.querySelector('.seven-weather-details');
            sevenWeatherDetails.innerHTML = '';

            forecastDays.forEach(forecastDay => {
                const date = forecastDay.date;
                const dayOfWeek = dayOfTheWeek(parseInt(date.substr(8, 2)), parseInt(date.substr(5, 2)), parseInt(date.substr(0, 4)));
                const iconUrl = forecastDay.day.condition.icon;
                const maxTemp = isFahrenheit ? forecastDay.day.maxtemp_f : forecastDay.day.maxtemp_c;
                const minTemp = isFahrenheit ? forecastDay.day.mintemp_f : forecastDay.day.mintemp_c;

                const forecastItem = document.createElement('div');
                const iconId = iconUrl.substr("//cdn.weatherapi.com/weather/64x64/".length);
                const iconPath = `./icons/${iconId}`;
                forecastItem.innerHTML =
                    `
                    <div class="forecast-date">${dayOfWeek}</div>
                    <img src="${iconPath}" alt="Weather Icon" class="forecast-icon">
                    <div class="forecast-temp">
                        <span class="max-temp">${maxTemp}${isFahrenheit ? "&#176;F" : "&#176;C"}</span>
                        <span class="min-temp">${minTemp}${isFahrenheit ? "&#176;F" : "&#176;C"}</span>
                    </div>
                `;
                sevenWeatherDetails.appendChild(forecastItem);
            });
        })
        .catch(error => {
            console.log('Error:', error);
        });
}



