
const app = document.querySelector('.weather-app');
const temp = document.querySelector('.temp');
const dateOutput = document.querySelector('.date');
const timeOutput = document.querySelector('.time');
const conditionOutput = document.querySelector('.condition');
const nameOutput = document.querySelector('.name');
const icon = document.querySelector('.icon');
const cloudOutput = document.querySelector('.cloud');
const humidityOutput = document.querySelector('.humidity');
const windOutput = document.querySelector('.wind');
const form = document.getElementById('locationInput');
const search = document.querySelector('.search');
const btn = document.querySelector('.submit');
const cities = document.querySelectorAll('.city');
const apiKey = 'b6ebbd7f40394af0893114308232106'

//let cityInput = "London";

cities.forEach((city)=>{
    city.addEventListener('click', (e) =>{
        cityInput = e.target.innerHTML;
        fetchWeatherData();
        app.style.opacity="1";
    });
})

form.addEventListener('submit', (e)=>{
    if(search.value.length == 0){
        alert('Please type in a city name');
    }else{
        cityInput = search.value;
        fetchWeatherData();
        search.value = "";
        app.style.opacity = "1";
    }
    e.preventDefault();
});
function dayOfTheWeek(day, month, year){
    const weekday = [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday"
    ];
    return weekday[new Date(`${day}/${month}/${year}`).getDay()];
};

function fetchWeatherData(){
    fetch(`http://api.weatherapi.com/v1/current.json?key=${apiKey}=${cityInput}`)
        .then(response =>  response.json())
        .then(data =>{
            console.log(data);
        } )
    
}