import React, { useEffect, useRef, useState } from 'react'
import './Weather.css'
import clear_day_icon from '../assets/clear-day.svg'
import clear_night_icon from '../assets/clear-night.svg'
import fewclouds_day_icon from '../assets/partly-cloudy-day.svg'
import fewclouds_night_icon from '../assets/partly-cloudy-night.svg'
import scattered_icon from '../assets/cloudy.svg'
import brokenclouds_day_icon from '../assets/overcast-day.svg'
import brokenclouds_night_icon from '../assets/overcast-night.svg'
import showerrain_day_icon from '../assets/partly-cloudy-day-rain.svg'
import showerrain_night_icon from '../assets/partly-cloudy-night-rain.svg'
import rain_icon from '../assets/rain.svg'
import thunderstorm_day_icon from '../assets/thunderstorms-day-rain.svg'
import thunderstorm_night_icon from '../assets/thunderstorms-night-rain.svg'
import snow_icon from '../assets/snow.svg'
import mist_icon from '../assets/mist.svg'
import humidity_icon from '../assets/humidity.png'
import search_icon from '../assets/search.png'
import wind_icon from '../assets/wind.png'

const Weather = () => {

    const inputRef = useRef()
    const [weatherData, setWeatherData] = useState(false);
    const [errorMessage, setErrorMessage] = useState(""); // New state for the error message

    const allIcons = {
        "01d": clear_day_icon,
        "01n": clear_night_icon,
        "02d": fewclouds_day_icon,
        "02n": fewclouds_night_icon,
        "03d": scattered_icon,
        "03n": scattered_icon,
        "04d": brokenclouds_day_icon,
        "04n": brokenclouds_night_icon,
        "09d": showerrain_day_icon,
        "09n": showerrain_night_icon,
        "10d": rain_icon,
        "10n": rain_icon,
        "11d": thunderstorm_day_icon,
        "11n": thunderstorm_night_icon,
        "13d": snow_icon,
        "13n": snow_icon,
        "50d": mist_icon,
        "50n": mist_icon,
    }

    const search = async (city)=>{
        
        try {
            if(city === ""){
                //alert("Enter City Name");
                setErrorMessage("Please enter a city name."); // Set error message for empty input
                setWeatherData(false); // Clear previous weather data
                return;
            }

            const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${import.meta.env.VITE_weatherID}`
            const response = await fetch(url)
            //const data = await response.json();

            if(!response.ok){
                //alert(data.message);
                if (response.status === 404) {
                    setErrorMessage("City not found. Please check the name and try again."); // Handle 404 error
                } 
                else {
                    setErrorMessage("An error occurred while fetching the weather data."); // Handle other errors
                }
                setWeatherData(false); // Clear previous weather data
                return;
            }

            const data = await response.json(); // Only parse JSON when response is OK
            console.log(data);

            const icon = allIcons[data.weather[0].icon] || clear_day_icon
            setWeatherData({
                humidity: data.main.humidity, 
                windSpeed: data.wind.speed,
                temperature: Math.floor(data.main.temp),
                location: data.name,
                icon: icon
            })

            setErrorMessage(""); // Clear error message if the search is successful

        } catch (error) {
            setWeatherData(false);
            setErrorMessage("Error fetching weather data.");
            console.error("Error in fetching weather data", error);
        }
    }

    useEffect(()=>{
        search("Pearland");
    },[])

  return (
    <div className='weather'>
        <div className="search-bar">
            <input ref={inputRef} type="text" placeholder='search'/>
            <img src={search_icon} alt="search" onClick={()=>search(inputRef.current.value)}/>
        </div>
        <p className={`error-message ${errorMessage ? "active" : ""}`}>{errorMessage}</p> {/* Toggle active class */}
        {weatherData?<>
            <img src={weatherData.icon} alt="clear" className='weather-icon'/>
            <p className='temperature'>{weatherData.temperature}°f</p>
            <p className='location'>{weatherData.location}</p>
            <div className='weather-data'>
                <div className='col'>
                    <img src={humidity_icon} alt="" />
                    <div>
                        <p>{weatherData.humidity} %</p>
                        <span>Humidity</span>
                    </div>
                </div>
                <div className='col'>
                    <img src={wind_icon} alt="" />
                    <div>
                        <p>{weatherData.windSpeed} MPH</p>
                        <span>Wind Speed</span>
                    </div>
                </div>
            </div>
        </>:<></>}
    </div>
  )
}

export default Weather
