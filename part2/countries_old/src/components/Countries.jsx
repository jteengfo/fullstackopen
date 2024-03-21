import axios, { Axios } from "axios"
import Country from "./Country"

const Countries = ({list, countryToShow}) => {

    //get error when list is empty ie. not array
    if (Array.isArray(list)) {
        return (
            // <ul>
            //     {list.map((e, index) =>
            //         <li key={index}> {e} <button onClick={() => countryToShow(e)}>Show</button> </li>
            //     )}
            // </ul> 
            <ul>
            {list.map((countryName, index) =>
                <li key={index}> {countryName} <button onClick={()=> countryToShow(countryName)}>Show</button></li>
            )}
        </ul> 
        )
    } else {
        return (
            <li>{list}</li>
        )
    }
    
}

export default Countries