import Contact from './Contact'

const Persons = ({personsToShow, deleteContact}) => personsToShow.map(person => <Contact key={person.name} name={person.name} number={person.number} deleteContact={deleteContact} id={person.id}/>)

export default Persons