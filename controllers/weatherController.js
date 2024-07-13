const axios = require('axios');

exports.getWeather = async (req, res) => {
  const { destination } = req.params;
  const apiKey = process.env.WEATHER_API_KEY;

  try {
    const weatherResponse = await axios.get(`http://api.openweathermap.org/data/2.5/weather?q=${destination}&appid=${apiKey}`);
    res.status(200).json(weatherResponse.data);
  } catch (err) {
    console.log('Weather API error:', err);
    res.status(500).json({ message: 'Weather API error', error: err });
  }
};
