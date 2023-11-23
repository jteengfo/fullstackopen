// create three new components: Header, Content, Total
// Header <- name of the course
// Content <- parts and their numbers of exercises
// Total <- total number of exercises

const Header = (props) => {
  console.log(props.props)
  return (
    <div>
      <h1>{props.props.name}</h1>
    </div>
  )
}

const Content = (props) => {
  // console.log(props.parts[0])
  return (
    <div>
      <Part num={props.props.parts[0].name} exercise={props.props.parts[0].exercises}/>
      <Part num={props.props.parts[1].name} exercise={props.props.parts[1].exercises}/>
      <Part num={props.props.parts[2].name} exercise={props.props.parts[2].exercises}/>
    </div>
  )
}

const Total = (props) => {
  const sum = props.props.parts[0].exercises + props.props.parts[1].exercises + props.props.parts[2].exercises
  return (
    <div>
      <p>Number of exercises {sum} </p>
    </div>
  )
}

const Part = (parts) => {
  // console.log(parts)
  return (
    <p>{parts.num} {parts.exercise}</p>
    
  )
}

const App = () => {
  const course = {
    name: 'Half Stack application development',
    parts: [
      {
        name: 'Fundamentals of React',
        exercises: 10
      },
      {
        name: 'Using props to pass data',
        exercises: 7
      },
      {
        name: 'State of a component',
        exercises: 14
      }
    ]
  }

  return (
    <div>
      <Header props={course} />
      <Content props={course} />
      <Total props={course} />
    </div>
  )
}

export default App