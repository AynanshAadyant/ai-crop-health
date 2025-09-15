import { fetchWeatherApi } from 'openmeteo';
import dotenv from "dotenv"

dotenv.config();

const currentWeather = async( req, res ) => {

    const { lat, long } = req.body;
    const params = {
        "latitude": lat,
        "longitude": long,
        "hourly": "temperature_2m",
        "current": ["temperature_2m", "precipitation", "relative_humidity_2m", "rain", "cloud_cover", "surface_pressure", "showers", "snowfall", "wind_speed_10m", "wind_direction_10m", "wind_gusts_10m"],
    };
    const url = process.env.OPEN_METEO_URL;
    const responses = await fetchWeatherApi(url, params); //fetches api data as an array

    const response = responses[0]; //first element only contains useful data

    const latitude = response.latitude();  //latitude of location
    const longitude = response.longitude();  //longitude of location
    const elevation = response.elevation();  //elevation of location
    const utcOffsetSeconds = response.utcOffsetSeconds();  //off of location from GMT in seconds

    const current = response.current(); //responses for current parameters

    const weatherData = {
        current: {
            latitude, 
            longitude,
            elevation,
            utcOffsetSeconds,
            time: new Date((Number(current.time()) + utcOffsetSeconds) * 1000),
            temperature_2m: current.variables(0).value(),
            precipitation: current.variables(1).value(),
            relative_humidity_2m: current.variables(2).value(),
            rain: current.variables(3).value(),
            cloud_cover: current.variables(4).value(),
            surface_pressure: current.variables(5).value(),
            showers: current.variables(6).value(),
            snowfall: current.variables(7).value(),
            wind_speed_10m: current.variables(8).value(),
            wind_direction_10m: current.variables(9).value(),
            wind_gusts_10m: current.variables(10).value(),
        }
    };

    return res.status( 200 ).json( {
        success: true,
        message: "Weather data fetched successfully",
        status: 200,
        body : {
            time : weatherData.current.time,
            current_temperature : weatherData.current.temperature_2m,
            current_relative_humidity : weatherData.current.relative_humidity_2m,
            current_precipitation: weatherData.current.precipitation,
            current_rain: weatherData.current.rain,
            current_cloud_cover: weatherData.current.cloud_cover,
            current_surface_pressure: weatherData.current.surface_pressure,
            current_showers: weatherData.current.showers,
            current_snowfall: weatherData.current.snowfall,
            current_wind_speed_10m: weatherData.current.wind_speed_10m,
            current_wind_direction_10m: weatherData.current.wind_direction_10m,
            current_wind_gusts_10m: weatherData.current.wind_gusts_10m,
        }
    })

}

export {currentWeather}