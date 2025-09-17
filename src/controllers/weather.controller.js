import { fetchWeatherApi } from 'openmeteo';
import dotenv from "dotenv"

dotenv.config();

const mapWeatherCode = (code) => {
  const codes = {
    0: "Clear sky",
    1: "Mainly clear",
    2: "Partly cloudy",
    3: "Overcast",
    45: "Fog",
    48: "Depositing rime fog",
    51: "Light drizzle",
    53: "Moderate drizzle",
    55: "Dense drizzle",
    61: "Slight rain",
    63: "Moderate rain",
    65: "Heavy rain",
    71: "Slight snow fall",
    73: "Moderate snow fall",
    75: "Heavy snow fall",
    80: "Slight rain showers",
    81: "Moderate rain showers",
    82: "Violent rain showers",
    95: "Thunderstorm",
    96: "Thunderstorm with slight hail",
    99: "Thunderstorm with heavy hail",
  };
  return codes[code] || "Unknown";
};


const currentWeather = async (req, res) => {
    try {
      console.log( "Weather api hit" );
    const { lat, long } = req.body;

    const params = {
      latitude: lat,
      longitude: long,
      daily: [
        "weather_code",
        "temperature_2m_max",
        "temperature_2m_min",
        "rain_sum",
        "wind_speed_10m_max",
        "showers_sum"
      ],
      hourly: [
        "weather_code",
        "temperature_2m",
        "relative_humidity_2m",
        "dew_point_2m",
        "precipitation_probability",
        "precipitation",
        "rain",
        "showers",
        "snowfall",
        "wind_speed_10m"
      ],
      current: [
        "weather_code",
        "temperature_2m",
        "relative_humidity_2m",
        "precipitation",
        "rain",
        "showers",
        "wind_speed_10m"
      ],
      forecast_days: 2, // ✅ today + tomorrow
    };

    const url = "https://api.open-meteo.com/v1/forecast";
    const responses = await fetchWeatherApi(url, params);
    const response = responses[0];
    const utcOffsetSeconds = response.utcOffsetSeconds();

    // --- Current weather ---
    const current = response.current();
    const currentWeather = {
      time: new Date((Number(current.time()) + utcOffsetSeconds) * 1000), 
      weather_code: current.variables(0).value(), //weather_code
      weather_description: mapWeatherCode(current.variables(0).value()), //type of weather expected
      temperature_2m: Math.floor( current.variables(1).value() ), //temperature in celsius
      relative_humidity_2m: Math.floor( current.variables(2).value() ), // % 
      precipitation: Math.floor( current.variables(3).value() ), //precipitation (mm)
      rain: Math.ceil( current.variables(4).value() ), //rainfall ( mm )
      showers: Math.ceil( current.variables(5).value() ), //showers from convetive percipitation (mm)
      wind_speed_10m: Math.ceil( current.variables(6).value() ), //wind speed at 10m elevation ( kmph)
    };

    // --- Daily forecast (today + tomorrow) ---
    const daily = response.daily();
    const times = [...Array((Number(daily.timeEnd()) - Number(daily.time())) / daily.interval())].map(
      (_, i) => new Date((Number(daily.time()) + i * daily.interval() + utcOffsetSeconds) * 1000)
    );

    const dailyForecast = {
      time: times, //timestamp
      weather_code: daily.variables(0).valuesArray(), //weather-code
      temperature_2m_max: daily.variables(1).valuesArray(), //max temperature at 2m elevation ( celsius )
      temperature_2m_min: daily.variables(2).valuesArray(), //min temperature at 2m elevation ( celsius )
      rain_sum: daily.variables(3).valuesArray(), //sum of daily rain ( mm )
      wind_speed_10m_max: daily.variables(4).valuesArray(), //max wind speed at 10m elevation ( kmph )
      showers_sum: daily.variables(5).valuesArray(), //showers sum ( mm )
    };

    // Pick tomorrow’s index (1 = tomorrow, 0 = today)
    const tomorrowForecast = {
      date: dailyForecast.time[1],
      weather_code: dailyForecast.weather_code[1],
      weather_description: mapWeatherCode(dailyForecast.weather_code[1]),
      temperature_max: Math.ceil(dailyForecast.temperature_2m_max[1] ),
      temperature_min: Math.floor(dailyForecast.temperature_2m_min[1] ),
      rain_sum: Math.ceil(dailyForecast.rain_sum[1] ),
      wind_speed_10m_max: Math.ceil(dailyForecast.wind_speed_10m_max[1] ),
      showers_sum: Math.ceil(dailyForecast.showers_sum[1] ),
    };
    console.log( "Weather data fetched" );
    return res.status(200).json({
      success: true,
      message: "Weather data fetched successfully",
      status: 200,
      body: {
        current: currentWeather,
        tomorrow: tomorrowForecast,
      },
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch weather data",
      status: 500,
      error: err.message,
    });
  }
};

export { currentWeather };
