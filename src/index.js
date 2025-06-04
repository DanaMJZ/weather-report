
// const LOCAL_PROXY_URL = 'http://localhost:5000';
const PROXY_URL = 'https://weather-report-proxy-server-qs3s.onrender.com';

//sky options configuration (wave 5)
const SKY_OPTIONS = {
    sunny: '☁️ ☁️ ☁️ ☀️ ☁️ ☁️',
    cloudy: '☁️☁️ ☁️ ☁️☁️ ☁️ 🌤 ☁️ ☁️☁️',
    rainy: '🌧🌈⛈🌧🌧💧⛈🌧🌦🌧💧🌧🌧',
    snowy: '🌨❄️🌨🌨❄️❄️🌨❄️🌨❄️❄️🌨🌨'
};

const queryCityName = () => {
  return document.getElementById('city-input').value;
};

//find coordinates by city name
const findCoordinates = (queryCityName) => {
  let latitude, longitude;

  // Return the promise chain created by the axios call
  return axios.get(`${PROXY_URL}/location`, {
      params: {
        q: queryCityName,
        format: 'json'
      }
    })
    .then((response) => {
      console.log('Raw location data:', response.data);
      if (!response.data || response.data.length === 0) {
        throw new Error('No location data returned from API');
  }
      latitude = response.data[0].lat;
      longitude = response.data[0].lon;
      console.log('success in findCoordinates!', latitude, longitude);

      return {latitude, longitude}; 
    })
    .catch((error) => {
      console.log('error in findCoordinates');
      // console.log(error); // If we want to see more info about the issue
    });
};

// name update in both header and display
const updateCityName = () => {
  const input = document.getElementById('city-input');
  const cityNameDisplay = document.getElementById('city-name');
  const headerCityDisplay = document.getElementById('headerCityName')

  cityNameDisplay.textContent = input.value;
  headerCityDisplay.textContent = input.value;
};

//'rename city' button click
const renameCity = () => {
  updateCityName();
};

//'reset city name' button click
const resetCityName = () => {
  const cityNameInput = document.getElementById('city-input');
  cityNameInput.value = 'Seattle'; //input field default value
  updateCityName(); //updates the displayed name
};

//convert temp from weather API response from K to F
const convertTemp = (temp) => {
    return (temp - 273.15) * (9 / 5) + 32;
};

const showCurrentTemp = (temp) => {
  const tempDisplay = document.getElementById('temperature');
  tempDisplay.textContent = temp;
};

const updateTemp = (delta) => {
  const tempDisplay = document.getElementById('temperature');
  let currentTemp = parseInt(tempDisplay.textContent, 10);
  tempDisplay.textContent = currentTemp + delta;
}

const increaseTemp = () => updateTemp(1);

const decreaseTemp = () => updateTemp(-1);


//update sky display based on selection (wave5)
const updateSkyDisplay = () => {
    const skySelect = document.getElementById('sky-type');
    const skyDisplay = document.getElementById('sky-display');
    const selectedSky = skySelect.value;
    
    skyDisplay.textContent = SKY_OPTIONS[selectedSky];
};

//get weather data from lat and lon
const getWeather = () => {
  const city = queryCityName()
  findCoordinates(city)
  .then(({ latitude, longitude }) => {
    return axios.get(`${PROXY_URL}/weather`, {
      params: {
        lat: latitude,
        lon: longitude
      },
    });
  })
    .then((response) => {
      // const weather = response.data;

      //const for temperature number//
      const currentTemp = Math.round(convertTemp(response.data.main.temp));
      showCurrentTemp(currentTemp);

      //update sky condition based on API response (wave5 bonus)
        const weatherCondition = response.data.weather[0].main.toLowerCase();
        const skySelect = document.getElementById('sky-type');
        
        if (weatherCondition.includes('clear')) {
            skySelect.value = 'sunny';
        } else if (weatherCondition.includes('cloud')) {
            skySelect.value = 'cloudy';
        } else if (weatherCondition.includes('rain')) {
            skySelect.value = 'rainy';
        } else if (weatherCondition.includes('snow')) {
            skySelect.value = 'snowy';
        }
        
        updateSkyDisplay();
    })
    .catch((error) => {
      console.log('Error getting the weather:', error);
    });
};

  // all event listeners
  const registerEventHandlers = () => {
    const cityNameInput = document.getElementById('city-input');
    const cityRenameBtn = document.getElementById('rename-city-btn');
    const cityResetBtn = document.getElementById('reset-city-btn');
    const getTempBtn = document.getElementById('get-temp-btn');  //TEMP might be displayed the moment it comes from response, no need for button
    const increaseTempBtn = document.getElementById('increase-temp');
    const decreaseTempBtn = document.getElementById('decrease-temp');
    
    const skySelect = document.getElementById('sky-type');

    //update city name as user types
    cityNameInput.addEventListener('input', updateCityName);

    //button clicks - city
    cityRenameBtn.addEventListener('click', renameCity);
    cityResetBtn.addEventListener('click', resetCityName);

    //button clicks - weather
    getTempBtn.addEventListener('click', getWeather); 
    increaseTempBtn.addEventListener('click', increaseTemp);
    decreaseTempBtn.addEventListener('click', decreaseTemp);
    //sky selection change (Wave5)
    skySelect.addEventListener('change', updateSkyDisplay);
};

//initialize sky display on load (wave5)
const initializeSkyDisplay = () => {
    const skyDisplay = document.getElementById('sky-display');
    skyDisplay.textContent = SKY_OPTIONS['sunny']; 
};



document.addEventListener('DOMContentLoaded', registerEventHandlers, initializeSkyDisplay);