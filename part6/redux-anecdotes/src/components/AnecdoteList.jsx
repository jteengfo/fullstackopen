import { useDispatch, useSelector } from "react-redux";

const AnecdoteList = () => {
    const dispatch = useDispatch()
    // const anecdotes = useSelector(state => [...state.anecdotes].sort((a, b) => b.votes - a.votes))

    const anecdotes = useSelector(({ filter, anecdotes }) => {
        if (filter === "") {
            return anecdotes.sort((a, b) => b.votes - a.votes)
        } else {
            const result = anecdotes.filter(anecdote => {
                console.log("filter is ", filter)
                return anecdote.content.toLowerCase().includes(filter.toLowerCase())
            })
            // were doing ...result because useSelector expects a new reference for redux to detect changes
            return [...result].sort((a, b) => b.votes - a.votes)
        }
            
    })
    

    const vote = (id) => {
        console.log('vote', id)
        dispatch({
            type: "VOTE",
            payload: { id }
        })
    }

    return (
        <div>
            {anecdotes.map( anecdote => 
                <div key={anecdote.id}>
                    <div>
                        {anecdote.content}
                    </div>
                    <div>
                        has {anecdote.votes}
                        <button onClick={() => vote(anecdote.id)}>vote</button>
                    </div>
                </div>
            )}
        </div>
    )
}

export default AnecdoteList