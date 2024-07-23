const apiKey = '9598ab201cd04171bd1145314241907'; // Your Weather API key
const apiUrl = 'https://api.weatherapi.com/v1/current.json';
const cache = new Map(); // Simple in-memory cache

async function getWeather(city) {
  if (cache.has(city)) {
    return cache.get(city); // Return cached response if available
  }

  try {
    const url = `${apiUrl}?key=${apiKey}&q=${city}`;
    console.log('Request URL:', url); // Log request URL for debugging

    const response = await fetch(url);
    
    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Invalid API key. Please check your API key.');
      }
      if (response.status === 404) {
        throw new Error('City not found');
      }
      throw new Error('An error occurred while fetching weather data');
    }
    
    const data = await response.json();
    cache.set(city, data); // Cache the response
    return data;
  } catch (error) {
    console.error('Fetch Error:', error); // Log errors for debugging
    throw error; // Rethrow to be caught in the event listener
  }
}

document.getElementById('weatherForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const city = document.getElementById('cityInput').value.trim();
  const resultDiv = document.getElementById('weatherResult');
  resultDiv.classList.add('hidden');
  resultDiv.innerHTML = '<div class="loading"></div>';
  resultDiv.classList.remove('error');

  if (city === "") {
    resultDiv.innerHTML = '<p>Please enter a city name.</p>';
    resultDiv.classList.add('error');
    resultDiv.classList.remove('hidden');
    return;
  }

  try {
    const weather = await getWeather(city);
    resultDiv.innerHTML = `
      <h2>${weather.location.name}, ${weather.location.country}</h2>
      <p>Temperature: ${weather.current.temp_c}°C</p>
      <p>Feels Like: ${weather.current.feelslike_c}°C</p>
      <p>Humidity: ${weather.current.humidity}%</p>
      <p>Wind Speed: ${weather.current.wind_kph} kph</p>
      <p>Conditions: ${weather.current.condition.text}</p>
    `;
    resultDiv.classList.remove('error');
  } catch (error) {
    resultDiv.innerHTML = `<p>${error.message}</p>`;
    resultDiv.classList.add('error');
  }
  resultDiv.classList.remove('hidden');
});
