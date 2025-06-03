
// const BASE_URL = 'https://weather-report-proxy-server-o4re.onrender.com';
const PROXY_URL = 'http://localhost:5000';

const findCoordinates = (query) => {
  let latitude, longitude;

  // Return the promise chain created by the axios call
  return axios.get('{PROXY_URL}/location',
    {
      params: {
        q: query,
        format: 'json'
      }
    })
    .then((response) => {
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
// all event listeners
  const registerEventHandlers = () => {
    const cityInput = document.getElementById('city-input');
    const renameBtn = document.getElementById('rename-city-btn');
    
    //update city name as user types
    cityInput.addEventListener('input', updateCityName);

    //button clicks
    renameBtn.addEventListener('click', renameCity);

};

document.addEventListener('DOMContentLoaded', registerEventHandlers);