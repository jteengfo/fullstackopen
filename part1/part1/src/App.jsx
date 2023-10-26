const Hello = (props) => {
  return (
    <div>
      <p>Hello world</p>
    </div>
  )
}

const App = () => {
  const friends = [
    'Peter',
    'Maya',
  ]
  return (
    <div>
      <h1>Greetings</h1>
      <p>{friends[0]}</p>
      <p>{friends[1]}</p>
    </div>
  )
}
export default App