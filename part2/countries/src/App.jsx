import axios from 'axios'
import { useEffect } from 'react'
import { useState } from 'react'
import './App.css'

function App() {

  // components
  const Countries = ({filteredCountryList, countryData, passCountryName, weatherData}) => { 
    // console.log(`inside countries`)
    // console.log(weatherData);
    if (filteredCountryList.length > 10 && inputCountry !== '') {
      return `Too many matches, specify another filter`
    } else if (filteredCountryList.length < 10 && filteredCountryList.length > 1 && inputCountry !== '') {
      return (
        <div>
          <ul>
            {filteredCountryList.map((countryName) => 
              <li key={countryName}>{countryName} <button onClick={() => passCountryName(countryName)}>Show</button></li> 
            )}
          </ul>
        </div>
      )
    } else if (filteredCountryList.length == 1 && inputCountry !== '') {
      return (
        <div>
          <Country countryData={countryData} weatherData={weatherData}/>
        </div>
      )
    }
  }

  const Country = ({countryData, weatherData}) => {
    const {name, capital, area, languages, flags} = countryData
    // const temperature = weatherData && weatherData.main.temp ? weatherData.main.temp: null

    if (!weatherData || !countryData || !name || !capital || !area || languages === null) {
      return (
        <div> Loading...</div>
      )
    } 
    // console.log(`inside Country`);
    // console.log(countryData);
    const languageValues = Object.values(languages)
    const temperature = weatherData.main.temp
    const windSpeed = weatherData.wind.speed
    const icon = weatherData.weather[0].icon
    console.log(icon);
    const weatherImg = `https://openweathermap.org/img/wn/${icon}@2x.png`
    // console.log(languageValues);
    return (
      <div>
        <h1>{name.common}</h1>
        <p>Capital: {capital}</p>
        <p>Area: {area}</p>

        <h2>Languages:</h2>
        <ul>
          {languageValues.map( language => (
              <li key={language}>{language}</li>
          ))}
        </ul>
        <img src={flags.png}/>
        <br/>
        <h2>Weather in {name.common}</h2>
        <p>Temperature: {temperature} Celsius</p>
        <img src={weatherImg} alt="" />
        <p>Wind: {windSpeed}</p>
      </div>
    )
  }

  // state hooks 
  const [countryList, setCountryList] = useState([])
  const [filteredCountryList, setFilteredCountryList] = useState([])
  const [inputCountry, setInputCountry] = useState([])
  const [countryData, setCountryData] = useState([])
  const [weatherData, setWeatherData] = useState([])

  // useeffect to get all countries once 
  useEffect(() => {
    axios
      .get(`https://studies.cs.helsinki.fi/restcountries/api/all`)
      .then(response => { 
        // gets all the names 
        const list = response.data.map(item => item.name.common)
        // console.log(list);
        setCountryList(list)
      })
  }, [])

  // run filterCountries when state of inputCountry is changed
  useEffect(() => {
    filterCountries();
  }, [inputCountry])

  useEffect(() => {
    if (filteredCountryList.length === 1) {
      getCountry(filteredCountryList[0])
    }

    // console.log(`inside useeffect`);
    // console.log(countryData);
    // console.log(`okay we good`);
  }, [filteredCountryList])

  useEffect(() => {
    if (countryData) {
      getWeatherData(countryData)
    }
  }, [countryData])

  // useEffect(() => {
  //   if (countryData) {
  //     getWeatherData(countryData)
  //   }
  // }, [countryData])

  // useEffect(() => {
  //   if (filteredCountryList.length === 1) {
  //     const country = filteredCountryList[0]
  //     getCountry(country)
  //   }
  // }, [inputCountry])

  // event handlers
  const handleInputChange = (event) => {
    const newValue = event.target.value
    setInputCountry(newValue)
    // console.log(newValue);
  }

  const passCountryName = (countryName) => {
    const newValue = countryName
    setInputCountry(newValue)
  }

  // functions
  const filterCountries = () => {
    const filteredList = countryList.filter( (country) => {
      return country.toLowerCase().includes(inputCountry.toLowerCase())
    })
    setFilteredCountryList(filteredList)

  }

  const getCountry = (countryName) => {
    axios
      .get(`https://studies.cs.helsinki.fi/restcountries/api/name/${countryName}`)
      .then(response => {
        const data = response.data
        setCountryData(data)
        // console.log(data);
      })
  }

  const getWeatherData = (countryData) => {
    // GET request
    console.log(countryData);
    const lat = countryData.latlng[0] //lat
    const long = countryData.latlng[1] //long 
    const apiKey = import.meta.env.VITE_SOME_KEY
    axios
      .get(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&exclude=minutely,hourly,daily,alerts&appid=${apiKey}&units=metric`)
      .then(response => {
        setWeatherData(response.data)
        console.log(`inside getWeatherData`);
        console.log(response.data)
      })
  }


  return (
    <div>
      <form>
        Find countries: <input onChange={(event) => handleInputChange(event)}/>
      </form>
      <Countries filteredCountryList={filteredCountryList} countryData={countryData} passCountryName={passCountryName} weatherData={weatherData}/>
    </div>
  )
}

export default App
