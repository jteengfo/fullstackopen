# Flux architecture and Redux
## Exercises 6.3 - 6.8

- [x] 6.3: Anecdotes, step 1
Implement the functionality for voting anecdotes. The number of votes must be saved to a Redux store.

- [x] 6.4: Anecdotes, step 2
Implement the functionality for adding new anecdotes.

You can keep the form uncontrolled like we did earlier.

- [x] 6.5: Anecdotes, step 3
Make sure that the anecdotes are ordered by the number of votes.

- [x] 6.6: Anecdotes, step 4
If you haven't done so already, separate the creation of action-objects to action creator-functions and place them in the src/reducers/anecdoteReducer.js file, so do what we have been doing since the chapter action creators.

- [x] 6.7: Anecdotes, step 5
Separate the creation of new anecdotes into a component called AnecdoteForm. Move all logic for creating a new anecdote into this new component.

- [x] 6.8: Anecdotes, step 6
Separate the rendering of the anecdote list into a component called AnecdoteList. Move all logic related to voting for an anecdote to this new component.

    Now the App component should look like this:

    ```
    import AnecdoteForm from './components/AnecdoteForm'
    import AnecdoteList from './components/AnecdoteList'

    const App = () => {
    return (
        <div>
        <h2>Anecdotes</h2>
        <AnecdoteList />
        <AnecdoteForm />
        </div>
    )
    }

    export default App
    ```

# Many reducers

## Exercise 6.9

- [x] 6.9 Better Anecdotes, step 7
Implement filtering for the anecdotes that are displayed to the user.


