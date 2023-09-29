import { useState, useEffect } from 'react';
import { FaTemperatureHigh, FaWind, FaCloud } from 'react-icons/fa';
import { HiOutlineClipboardDocumentList } from 'react-icons/hi2';
import { WiHumidity } from 'react-icons/wi';
import { FaLocationDot } from 'react-icons/fa6';
import { BiErrorCircle } from 'react-icons/bi';

const api = {
  key: 'd689711c770ae571871fe6c651f29462',
  base: 'https://api.openweathermap.org/data/2.5/',
};

function App() {
  const [search, setSearch] = useState('');
  const [weather, setWeather] = useState({});
  const [tempUnit, setTempUnit] = useState('Celsius');
  const [coordinates, setCoordinates] = useState({});
  const [showButton, setShowButton] = useState(false);
  const [loading, setLoading] = useState(true); // Add loading state

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      async ({ coords: { latitude, longitude } }) => {
        setCoordinates({ lat: latitude, lon: longitude });

        try {
          const response = await fetch(
            `${api.base}weather?lat=${latitude}&lon=${longitude}&units=metric&APPID=${api.key}`
          );

          if (response.ok) {
            const result = await response.json();
            setWeather(result);
          } else {
            console.error('Network response was not ok.');
          }
        } catch (error) {
          console.error('Error fetching weather data:', error);
        } finally {
          setLoading(false); // Set loading to false when done
        }
      }
    );
  }, []);

  /*
    Search button is pressed. Make a fetch call to the Open Weather Map API.
  */
  const searchPressed = (e) => {
    e.preventDefault();
    setLoading(true); // Set loading to true when making a new request
    fetch(`${api.base}weather?q=${search}&units=metric&APPID=${api.key}`)
      .then((res) => res.json())
      .then((result) => {
        console.log(result);
        setWeather(result);
        setShowButton(typeof result.main !== 'undefined');
        setLoading(false); // Set loading to false when done
      });
  };

  const getGeolocation = () => {
    navigator.geolocation.getCurrentPosition(
      ({ coords: { latitude, longitude } }) => {
        setCoordinates({ lat: latitude, lon: longitude });
        setLoading(true); // Set loading to true when making a new request

        // Fetch weather data using coordinates when the button is clicked
        fetch(
          `${api.base}weather?lat=${latitude}&lon=${longitude}&units=metric&APPID=${api.key}`
        )
          .then((res) => res.json())
          .then((result) => {
            setWeather(result);
            setLoading(false); // Set loading to false when done
          });
      }
    );
    setShowButton(false);
  };

  return (
    <div className="App">
      <section className="App-header">
        {/* HEADER */}
        <h1 className="page-title">Weather App 🌞</h1>

        {/* Search Box - Input + Button */}
        <form
          style={{ display: 'flex', marginBottom: '1em' }}
          onSubmit={searchPressed}
        >
          <input
            type="text"
            className="input-btn"
            placeholder="Enter city/town..."
            onChange={(e) => setSearch(e.target.value)}
            required
          />
          <button className="button-19" type="submit" onClick={searchPressed}>
            Search
          </button>
        </form>

        {showButton ? (
          <button className="button-19 small" onClick={getGeolocation}>
            Get Your Location
          </button>
        ) : (
          ''
        )}

        {/* If weather is not undefined and loading is false, display results from API */}
        {
          !loading && typeof weather.main !== 'undefined' ? (
            <div className="weather-info-container">
              {/* Location */}
              <div className="weather-info">
                <div className="weather-info-icon">
                  <FaLocationDot />
                </div>
                <p>{weather.name}</p>
              </div>

              {/* Temperature */}
              <div className="weather-info temp">
                <div className="weather-info-icon">
                  <FaTemperatureHigh />
                </div>
                <p style={{ marginRight: '1em' }}>
                  {tempUnit === 'Fahrenheit'
                    ? ((weather.main.temp * 9) / 5 + 32).toFixed(2) + ' °F'
                    : `${weather.main.temp} °C`}
                </p>
                <select
                  value={tempUnit}
                  onChange={(e) => setTempUnit(e.target.value)}
                >
                  <option value="Celsius">Celsius</option>
                  <option value="Fahrenheit">Fahrenheit</option>
                </select>
              </div>

              <div className="weather-info">
                <div className="weather-info-icon">
                  <FaWind />
                </div>
                <p>{weather.wind.speed}</p>
              </div>

              <div className="weather-info">
                <div className="weather-info-icon">
                  <WiHumidity className="humidity-icon" />
                </div>
                <p>{weather.main.humidity}</p>
              </div>

              {/* Weather Condition */}
              <div className="weather-info cloud">
                <FaCloud className="weather-info-icon" />
                <p>{weather.weather[0].main}</p>
              </div>
              <div className="weather-info">
                <HiOutlineClipboardDocumentList className="weather-info-icon" />
                <p>({weather.weather[0].description})</p>
              </div>
            </div>
          ) : null /* Don't display anything while loading */
        }

        {/* Display an error message when loading is false and weather data is undefined */}
        {
          !loading && typeof weather.main === 'undefined' ? (
            <div className="error-container">
              <h2 className="error">
                {' '}
                <BiErrorCircle /> Please enter a valid city/town
              </h2>
              <button className="button-19 small" onClick={getGeolocation}>
                Get Your Location
              </button>
            </div>
          ) : null /* Don't display anything while loading */
        }
      </section>
    </div>
  );
}

export default App;
