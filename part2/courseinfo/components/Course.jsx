

const Course = ({course}) => {
    const contents = course.parts
    console.log("contents", contents);
  
    return (
      <div>
        <div>
          <h1>{course.name}</h1>
        </div>
        <div>
          <ul>
            {contents.map(content => <li key={content.id}>{content.name} {content.exercises}</li>)}
          </ul>
            <span>Total Exercise </span>
            {contents.reduce((sum, content) => sum + content.exercises, 0)}
        </div>
      </div>
    )
  } 

export default Course