const db = require('../db');
const axios = require('axios');

exports.calculateVacation = async (req, res) => {
  db.query('SELECT * FROM tbl_42_preferences', async (err, results) => {
    if (err) {
      console.log('Database error:', err);
      return res.status(500).json({ message: 'Database error', error: err });
    }
    if (results.length < 5) {
      return res.status(400).json({ message: 'Not all preferences are submitted yet' });
    }

    const destinations = {};
    const vacationTypes = {};
    const dates = [];

    results.forEach(pref => {
      if (destinations[pref.destination]) {
        destinations[pref.destination]++;
      } else {
        destinations[pref.destination] = 1;
      }

      if (vacationTypes[pref.vacation_type]) {
        vacationTypes[pref.vacation_type]++;
      } else {
        vacationTypes[pref.vacation_type] = 1;
      }

      dates.push({ start: new Date(pref.start_date), end: new Date(pref.end_date) });
    });

    const majorityDestination = Object.keys(destinations).reduce((a, b) => destinations[a] > destinations[b] ? a : b);
    const majorityVacationType = Object.keys(vacationTypes).reduce((a, b) => vacationTypes[a] > vacationTypes[b] ? a : b);

    const overlappingDates = dates.reduce((acc, dateRange) => {
      if (!acc) return dateRange;
      return {
        start: new Date(Math.max(acc.start, dateRange.start)),
        end: new Date(Math.min(acc.end, dateRange.end)),
      };
    });

    if (overlappingDates.start > overlappingDates.end) {
      return res.status(400).json({ message: 'No overlapping dates found' });
    }

    try {
      const weatherApiKey = process.env.WEATHER_API_KEY;
      console.log('Weather API Key:', weatherApiKey); // Add logging
      if (!weatherApiKey) {
        return res.status(500).json({ message: 'Weather API key is not set' });
      }

      const weatherUrl = `http://api.openweathermap.org/data/2.5/weather?q=${majorityDestination}&appid=${weatherApiKey}`;
      console.log('Weather URL:', weatherUrl); // Add logging

      const weatherResponse = await axios.get(weatherUrl);
      console.log('Weather Response:', weatherResponse.data); // Add logging
      const weather = weatherResponse.data.weather[0].description;

      res.status(200).json({
        destination: majorityDestination,
        vacation_type: majorityVacationType,
        start_date: overlappingDates.start.toISOString().split('T')[0],
        end_date: overlappingDates.end.toISOString().split('T')[0],
        weather: weather
      });
    } catch (error) {
      console.log('Error fetching weather information:', error);
      if (error.response) {
        console.log('Error Response:', error.response.data);
        return res.status(error.response.status).json({ message: 'Error fetching weather information', error: error.response.data });
      }
      return res.status(500).json({ message: 'Error fetching weather information', error });
    }
  });
};
