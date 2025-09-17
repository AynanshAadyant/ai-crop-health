import { fetchWeatherApi } from 'openmeteo';
import dotenv from "dotenv"

dotenv.config();

const currentWeather = async (req, res) => {
    try {
    const { lat, long } = req.body;

    const params = {
      latitude: lat,
      longitude: long,
      daily: [
        "temperature_2m_max",
        "temperature_2m_min",
        "rain_sum",
        "wind_speed_10m_max",
        "showers_sum"
      ],
      hourly: [
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
      temperature_2m: current.variables(0).value(),
      relative_humidity_2m: current.variables(1).value(),
      precipitation: current.variables(2).value(),
      rain: current.variables(3).value(),
      showers: current.variables(4).value(),
      wind_speed_10m: current.variables(5).value(),
    };

    // --- Daily forecast (today + tomorrow) ---
    const daily = response.daily();
    const times = [...Array((Number(daily.timeEnd()) - Number(daily.time())) / daily.interval())].map(
      (_, i) => new Date((Number(daily.time()) + i * daily.interval() + utcOffsetSeconds) * 1000)
    );

    const dailyForecast = {
      time: times,
      temperature_2m_max: daily.variables(0).valuesArray(),
      temperature_2m_min: daily.variables(1).valuesArray(),
      rain_sum: daily.variables(2).valuesArray(),
      wind_speed_10m_max: daily.variables(3).valuesArray(),
      showers_sum: daily.variables(4).valuesArray(),
    };

    // Pick tomorrow’s index (1 = tomorrow, 0 = today)
    const tomorrowForecast = {
      date: dailyForecast.time[1],
      temperature_max: dailyForecast.temperature_2m_max[1],
      temperature_min: dailyForecast.temperature_2m_min[1],
      rain_sum: dailyForecast.rain_sum[1],
      wind_speed_10m_max: dailyForecast.wind_speed_10m_max[1],
      showers_sum: dailyForecast.showers_sum[1],
    };

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
