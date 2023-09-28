const userBtn = document.querySelector("[data-userTab]");
const searchBtn = document.querySelector("[data-searchTab]");
const userContainer = document.querySelector(".main");
const grantContainer = document.querySelector(".grant-container");
const searchTab = document.querySelector(".search-tab");
const loading = document.querySelector(".loading-container");
const weatherContainer = document.querySelector(".your-weather");
const searchForm = document.querySelector(".form-container");




const API_KEY = "d1845658f92b31c64bd94f06f7188c9c";

let currentTab = userBtn;
currentTab.classList.add('current-tab');
getFromSessionStorage();

function switchTab(clickedTab){
    currentTab.classList.remove('current-tab');
    currentTab = clickedTab;
    currentTab.classList.add('current-tab');

    if(!searchForm.classList.contains("active")) {
        grantContainer.classList.remove("active");
        weatherContainer.classList.remove("active");
        searchForm.classList.add("active");
    } else{
        searchForm.classList.remove('active')
        weatherContainer.classList.remove('active')
        getFromSessionStorage();
    }
    
}
userBtn.addEventListener("click" , () =>{
    switchTab(userBtn);
    
});

searchBtn.addEventListener("click" , () =>{
    switchTab(searchBtn);
});

function getFromSessionStorage() {
    const localCoordinates = sessionStorage.getItem("user-coordinate");
    if(!localCoordinates) {
        grantContainer.classList.add('active')
    
    } else {
        const coordinates = JSON.parse(localCoordinates);
        fetchUserWeatherInfo(coordinates);
    }

}

async function fetchUserWeatherInfo(coordinates){
    const {lat, lon} = coordinates;

    grantContainer.classList.remove('active');
    loading.classList.add('active');

    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`);

        const data = await response.json();
        loading.classList.remove('active');
        weatherContainer.classList.add('active');
        renderWeatherInfo(data);
        console.log("hey1")

    } catch (error) {
        loading.classList.remove('active');
        alert(404);

    }
}

function renderWeatherInfo(weatherInfo) {

    const cityName = document.querySelector('.city');
    const countyImg = document.querySelector('.country-icon');
    const weatherIcon = document.querySelector('.weather-icon');
    const temp = document.querySelector('.temp');
    const windSpeed = document.querySelector('.wind-speed');
    const humidity = document.querySelector('.HUMIDITY');
    const cloudiness = document.querySelector('.CLOUDS');
    const weatherDes = document.querySelector('.weather-description');

    cityName.innerText = weatherInfo?.name;
    countyImg.src = `https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`;
    weatherDes.innerText = weatherInfo?.weather?.[0]?.description;
    weatherIcon.src = `https://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`;
    temp.innerText = `${weatherInfo?.main?.temp} °C`; 
    windSpeed.innerText = `${ weatherInfo?.wind?.speed} m/sec`;
    humidity.innerText = `${weatherInfo?.main?.humidity} %`;
    cloudiness.innerText = `${weatherInfo?.clouds?.all} %`;

    console.log("hey2")

}

const grandBtn = document.querySelector("[data-grant]");

grandBtn.addEventListener('click' , () =>{
    if(navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    } else {
        alert("No geolocation not support")
    }
})

function showPosition(position){
    const userCoordinates = {
        lat: position.coords.latitude,
        lon: position.coords.longitude,
    }

    sessionStorage.setItem("user-coordinate" , JSON.stringify(userCoordinates));
    fetchUserWeatherInfo(userCoordinates);
}

const searchInp = document.querySelector("[data-searchInput]");

searchForm.addEventListener('submit' , (e) =>{
    e.preventDefault();

    let cityName = searchInp.value;

    if(cityName === ""){
        return
    }else{
        fetchUserWeather(cityName);
    }
})

async function fetchUserWeather(city){
    loading.classList.add('active');
    weatherContainer.classList.remove('active');
    grantContainer.classList.remove('active');

    try{
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`);

    const data = await response.json();
    loading.classList.remove('active');
    weatherContainer.classList.add('active');
    renderWeatherInfo(data);
    } catch(err){
        loading.classList.add('active');
        alert("Try Again Bro");
        alert(404);
    }
}