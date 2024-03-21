const Contact = ({ name, number, deleteContact, id }) => {
    return (
        <li> 
            {name} {number}
            <button onClick={() => deleteContact(id)}>Delete</button>
        </li>
    )
}

export default Contact