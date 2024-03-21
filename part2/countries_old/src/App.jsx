import { useEffect } from 'react'
import { useState } from 'react'

import axios from 'axios'
import Countries from './components/Countries'
import Country from './components/Country'

function App() {
  const [countries, setCountries] = useState([])
  const [newCountry, setNewCountry] = useState('')
  const [results, setResults] = useState([])
  const [countryData, setCountryData] = useState([])

  
  useEffect(() => {
    axios
    .get(`https://studies.cs.helsinki.fi/restcountries/api/all`)
    .then(response => {
      const list = response.data.map(item => item.name.common)
      setCountries(list)
      // console.log(list);
    })
  }, [])

  useEffect(() => {
    filterCountries();
    
  }, [newCountry]);

  useEffect(()=> {
    if (results.length === 1) {
      getCountry(results[0])
    }
  }, [results])

  const handleCountryChange = (event) => {
    setNewCountry(event.target.value)
  }

  const filterCountries = () => {
    const filteredList = countries.filter((country) => {
      return country.toLowerCase().includes(newCountry.toLowerCase())
    })
  
    setResults(filteredList)
  }

  const getCountry = () => {
    axios
        .get(`https://studies.cs.helsinki.fi/restcountries/api/name/${results}`)
        .then(response => {
          console.log(response.data);
          setCountryData(response.data)
        })
        .catch(error => console.error('There was an error fetching the country data:', error))
  }

  const countryToShow = (countryName) => {
    console.log("Country to show:", countryName);
    setNewCountry(countryName)
    // getCountry(filteredCountry)
  }


  const contentToRender = () => {

    if (results.length > 10 && newCountry !== '') {
      return 'Too many matches, specify another filter'
    } else if (results.length != 1 && newCountry !== '') {
      // return <Countries list={results} showCountry={countryToShow}/>
      return <Countries list={results} countryToShow={()=> countryToShow()}/>
    } else if (results.length === 1 && newCountry !== ''){
      // do a get request to that specific country
      return <Country responseData={countryData}/>
    } 

  }

  return (
    <div>
      <form>
      find countries: <input value={newCountry} onChange={handleCountryChange}/>
      <br></br>
      {contentToRender()}
      </form>
    </div>
  )
}

export default App
