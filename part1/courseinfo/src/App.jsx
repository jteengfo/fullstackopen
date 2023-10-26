// create three new components: Header, Content, Total
// Header <- name of the course
// Content <- parts and their numbers of exercises
// Total <- total number of exercises

const Header = (course) => {
  return (
    <div>
      <h1>{course.header}</h1>
    </div>
  )
}

const Content = (contents) => {
  return (
    <div>
      <Part num={contents.part1} exercise={contents.exercise1}/>
      <Part num={contents.part2} exercise={contents.exercise2}/>
      <Part num={contents.part3} exercise={contents.exercise3}/>
    </div>
  )
}

const Total = (totals) => {
  return (
    <div>
      <p>Number of exercises {totals.sum} </p>
    </div>
  )
}

const Part = (parts) => {
  return (
    <p>{parts.num} {parts.exercise}</p>
    
  )
}

const App = () => {
  const course = 'Half Stack application development'
  const part1 = 'Fundamentals of React'
  const exercises1 = 10
  const part2 = 'Using props to pass data'
  const exercises2 = 7
  const part3 = 'State of a component'
  const exercises3 = 14

  return (
    <div>
      <Header 
        header= {course}
      />
      <Content 
        part1={part1}
        exercise1={exercises1}
        part2={part2}
        exercise2={exercises2}
        part3={part3}
        exercise3={exercises3}
      />
      <Total 
        sum={exercises1 + exercises2 + exercises3}
      />
    </div>
  )
}

export default App