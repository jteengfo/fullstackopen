import { useState } from 'react'

const Button = ({text, handleClick}) => {
  return (
    <button onClick={handleClick}>{text}</button>
  )
}
const App = () => {
  const anecdotes = [
    'If it hurts, do it more often.',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 10 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
    'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when diagnosing patients.',
    'The only way to go fast, is to go well.'
  ]
  const length = anecdotes.length
  const votesArray = Array(length).fill(0)

  const [selected, setSelected] = useState(0)
  const [votes, setVotes] = useState(votesArray)
  const [maxIndex, setMaxIndex] = useState(0)


  const getRandomNumber = (length) => {
    return Math.floor(Math.random() * length);
  }

  const selectAnecdote = () => {
    console.log("length is", length)
    // console.log("votes", votes)
    // console.log("random number selectded is:", getRandomNumber(length))
    const selectedNumber = getRandomNumber(length)
    setSelected(selectedNumber)
  }

  const selectMostVotedAnecdote = (votesProps) => {
    setMaxIndex(() => {
      console.log("votesProps", votesProps)
      const maxIndex = votesProps.indexOf(Math.max(...votesProps))
      console.log("maxIndex is", maxIndex)
      return maxIndex
    })
    
  }
  // const voteAnecdote = () => {
  //   console.log("selected value", selected)
  //   console.log("vote array", votes)
  //   const copyVotesArray = [...votes] // new object
  //   copyVotesArray[selected] += 1
  //   setVotes(copyVotesArray)
  // }

  // chatGPT suggested using the functional form of the setVotes function to deal with the asynchronous state. 
  // I will start using this method when dealing with asynchronous states
  const voteAnecdote = () => {
    setVotes(() => {
      const copyVotesArray = [...votes];
      copyVotesArray[selected] += 1;
      console.log("selected value", selected);
      console.log("vote array", copyVotesArray);
      selectMostVotedAnecdote(copyVotesArray)
      return copyVotesArray;
    });
  };

  return (
    <div>
      <div>
        <h1>Anecdotes of the day</h1>
        {anecdotes[selected]}
      </div>
      <div>
        <Button text="Vote" handleClick={() => voteAnecdote(votes)}/>
        <Button text="Next Anecdote" handleClick={() => selectAnecdote()}/>
      </div>
      <div>
        <h1>Anecdotes with most votes</h1>
        <p>{anecdotes[maxIndex]}</p>
      </div>
      
    </div>
  )
}

export default App