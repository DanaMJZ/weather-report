
// const LOCAL_PROXY_URL = 'http://localhost:5000';
const PROXY_URL = 'https://weather-report-proxy-server-qs3s.onrender.com';

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
      // Check if data exists before destructuring
      if (!response.data || response.data.length === 0) {
        throw new Error('No location data returned from API');
  }
      latitude = response.data[0].lat;
      longitude = response.data[0].lon;
      console.log('success in findCoordinates!', latitude, longitude);

      return {latitude, longitude}; // Return the data we want to pass on
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
    const getTempBtn = document.getElementById('get-temp-btn'); - //TEMP might be displayed the moment it comes from response, no need for button
    
    //update city name as user types
    cityNameInput.addEventListener('input', updateCityName);

    //button clicks
    cityRenameBtn.addEventListener('click', renameCity);
    cityResetBtn.addEventListener('click', resetCityName);
    getTempBtn.addEventListener('click', getWeather); 

};

document.addEventListener('DOMContentLoaded', registerEventHandlers);