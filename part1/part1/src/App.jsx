import { useState } from 'react'

// const Display = ({counter}) => <div>{counter}</div>
// const Button = ({text, handleClick}) => <button onClick={handleClick}>{text}</button>
const Button = ({handleClick, text}) => (
  <button onClick={handleClick}>{text}</button>
)
const History = (props) => {
  if (props.allClicks.length === 0) {
    return (
        <div>
          the app is used by pressing the buttons
        </div>
    )
  }
  return (
    <div>
      button press history: {props.allClicks.join(" ")}
    </div>
  )
}

const App = () => {
  const [value, setValue] = useState(10)
  

  const setToValue = (newValue) => {
    console.log('value now', newValue)  // print the new value to console
    setValue(newValue)
  }
  
  const Display = props => <div>{props.value}</div>

  
  return (
    <div>
      {value}
      <Button handleClick={() => setToValue(1000)} text="thousand" />
      <Button handleClick={() => setToValue(0)} text="reset" />
      <Button handleClick={() => setToValue(value + 1)} text="increment" />
    </div>
  )
}

export default App