import { useDispatch } from "react-redux"
import { filterChange } from "../reducers/filterReducer"

const AnecdoteFilter = () => {

    const dispatch = useDispatch()

    // event handler
    const handleChange = (event) => {
        dispatch(filterChange(event.target.value))
    }

    const style = {
        marginBottom: 10
    }

    return (
        <div style={style}>
            filter
            <input onChange={handleChange}/>
        </div>
    )
}

export default AnecdoteFilter