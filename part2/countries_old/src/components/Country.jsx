const Country = ({responseData}) => {

    const {name, area, flags, languages, capital} = responseData
    if (!responseData || !name || !name.common || languages == null) {
        return <div>Loading...</div>;
    }

    //note: languagesObject is a dictionary
    const languagesValues = Object.values(languages)
    // const countryName = responseData.name.common  
    console.log(`languages: ${languagesValues}`);
    // console.log(`country name: ${countryName}`);
    return (
        <div>
            <h1>{name.common}</h1>
            <br/>
            <p>Capital: {capital}</p>
            <p>Area: {area}</p>
            <br/>
            <h2>languages:</h2>
            <ul>
                {languagesValues.map(languageValue => (
                    <li key={languageValue}>{languageValue}</li>
                ))}
            </ul>
            
            <img src={flags.png}/>
        </div>
        
    )
}

export default Country