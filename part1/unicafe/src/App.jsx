import { useState } from 'react'

// create components

const Title = ({text}) => <h1>{text}</h1>

const Button = (props) => <button onClick={props.handleClick}>{props.text}</button>

const Display = ({text, value}) => {
  return (
    <p>{text} {value}</p>
  )
}
const StatisticLine = ({text, values}) => {
  if (text==="good") {
    return <p>{values[0]}</p>
  }
  if(text==="neutral") {
    return <p>{values[1]}</p>
  }
  if(text === "bad") {
    return <p>{values[2]}</p>
  }
  if (text === "all") {
    return <p>{values[0] + values[1] + values[2]}</p>
  }
  if (text === "average") {
    return <p>{((values[0] * 1 + values[1] * 0 + values[2] * -1)/(values[0] + values[1] + values[2])).toFixed(1)}</p>
  }
  if (text==="percentage") {
    return <p>{(((values[0])/ (values[0] + values[1] + values[2])) * 100).toFixed(1)} %</p>
  }
}
const Statistics = ({values}) => {
  if (values[0] + values[1] + values[2] === 0) {
    return (
      <div>
        <h1>Statistics</h1>
        <p>No feedback Given</p>
      </div>
    )
  }
  return (
    <div>
      <h1>Statistics</h1>
      <table>
        <tbody>
          <tr>
            <td>Good</td>
            <td><StatisticLine text='good' values={values}/></td>
          </tr>
          <tr>
            <td>Neutral</td>
            <td><StatisticLine text='neutral' values={values}/></td>
          </tr>
          <tr>
            <td>Bad</td>
            <td><StatisticLine text='bad' values={values}/></td>
          </tr>
          <tr>
            <td>All</td>
            <td><StatisticLine text='all' values={values}/></td>
          </tr>
          <tr>
            <td>Average</td>
            <td><StatisticLine text='average' values={values}/></td>
          </tr>
          <tr>
            <td>Percentage</td>
            <td><StatisticLine text='percentage' values={values}/></td>
          </tr>
        </tbody>
      </table>
    </div>
  )
  // return (
  //   <p>{text} {value}</p>
  // )
}

const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)
  const [average, setAverage] = useState(0)

  const values = [good, neutral, bad]
  // const returnAverage = (good, neutral, bad) => {
  //   const value = (good * 1 + neutral * 0 + bad * -1)
  //   return value
  // }
  

  return (
    <div>
      <Title text="Give Feedback"/>

      {/* Buttons */}
      <Button text="good" handleClick={() => setGood(good + 1)}/>
      <Button text="neutral" handleClick={() => setNeutral(neutral + 1)}/>
      <Button text="bad" handleClick={() => setBad(bad + 1)}/>
      
      {/* Display results */}
      <Statistics text="all" values={values}/>
    </div>
  )
}

export default App