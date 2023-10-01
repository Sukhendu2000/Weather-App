const input = document.getElementById("cityInput");
const btn = document.getElementById("btn");
const icon = document.querySelector(".icon");
const weatherBox = document.querySelector(".weather-box"); 
const weather = document.querySelector(".weather");
const temperature = document.querySelector(".temperature");
const description = document.querySelector(".description");
const errorMessage = document.querySelector(".error-message");
const sunriseTime = document.querySelector(".sunrise-time");
const sunsetTime = document.querySelector(".sunset-time");


function displayTimeWithAMPM(timestamp) {
    // Convert the timestamp to a Date object
    const date = new Date(timestamp * 1000); // Convert from seconds to milliseconds

    // Get the hours and minutes
    const hours = date.getHours();
    const minutes = date.getMinutes();

    // Determine whether it's AM or PM
    const ampm = hours >= 12 ? 'PM' : 'AM';

    // Convert hours from 24-hour format to 12-hour format
    const formattedHours = hours % 12 || 12;

    // Format the time as HH:MM AM/PM
    const formattedTime = `${formattedHours}:${minutes < 10 ? '0' : ''}${minutes} ${ampm}`;

    return formattedTime;
}


function displayError(message) {
    // Display an error message to the user
    errorMessage.textContent = message;
    errorMessage.style.color = "red";
    weatherBox.style.borderColor = "red";
    icon.innerHTML = ""; // Clear the icon
    weather.innerHTML = ""; // Clear weather information
    temperature.innerHTML = "";
    description.innerHTML = "";
    sunriseTime.innerHTML = ""; // Clear sunrise time
    sunsetTime.innerHTML = ""; // Clear sunset time
}

function clearError() {
    // Clear the error message and reset the style
    errorMessage.textContent = "";
    weatherBox.style.borderColor = "green";
    sunriseTime.innerHTML = ""; // Clear sunrise time
    sunsetTime.innerHTML = ""; // Clear sunset time
}

function getWeather(city) {
    clearError(); // Clear any previous error messages

    const apiKey = '39756fdf2cfe5d0d4014bb0b08162d94';

    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`)
        .then(response => {
            if (!response.ok) {
                throw new Error("City not found");
            }
            return response.json();
        })
        .then(data => {
            console.log(data)
            // Check if the response contains an error message
            if (data.message && data.message === "city not found") {
                throw new Error("City not found");
            }

            // Getting icon
            const iconCode = data.weather[0].icon;
            const iconUrl = `http://openweathermap.org/img/w/${iconCode}.png`;

            // Create an <img> element to display the icon
            const iconImg = document.createElement("img");
            iconImg.src = iconUrl;
            iconImg.alt = "Weather icon";

            // Clear previous content and append the new <img> element to the icon container
            icon.innerHTML = '';
            icon.appendChild(iconImg);

            // Displaying Ciity name
            const ciityName = data.name;
            const weatherCountry = data.sys.country;
            weather.innerHTML = `${ciityName}, ${weatherCountry}`;

            // Displaying Temperature
            let cityTemperature = data.main.temp;
            cityTemperature = cityTemperature - 273;
            const temp = cityTemperature.toFixed(2); // Handeling decimal point
            temperature.innerHTML = `${temp}°C`

            // Displaying description
            const weatherDesc = data.weather[0].description;
            description.innerHTML = `${weatherDesc}`;

             // Displaying sunrise & sunset
            const sunriseTimestamp = data.sys.sunrise;
            const sunsetTimestamp = data.sys.sunset;
            
            sunriseTime.innerHTML = `Sunrise: ${displayTimeWithAMPM(sunriseTimestamp)}`;
            sunsetTime.innerHTML = `Sunset: ${displayTimeWithAMPM(sunsetTimestamp)}`;
            
        })
        .catch(error => {
            // Handle the error and display an error message
            console.error(error);
            displayError("An error occurred. Please try again later.");
        });
}

btn.addEventListener("click", () => {
    let city = input.value.trim(); // Trim whitespace from input
    if (city !== "") {
        getWeather(city);
    } else {
        displayError("Please enter a city name.");
    }

    if (weatherBox.style.display === 'none' || weatherBox.style.display === '') {
        weatherBox.style.display = 'block';
    } else {
        weatherBox.style.display = 'none';
    }

});
