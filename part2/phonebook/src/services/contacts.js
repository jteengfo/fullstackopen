import axios from 'axios'

const baseUrl = "api/persons"

// Create
const create = (baseUrl, newContact) => {
    const request = axios.post(baseUrl, newContact)
    return request.then(response => response.data)
}

// Read
const getAll = () => {
    const request = axios.get(baseUrl)
    return request.then(response => response.data)
}

// Update
const update = (id, newContact) => {
    const request = axios.put(`${baseUrl}/${id}`, newContact)
    return request.then(response => response.data)
}

// Delete
const removeUser = (id) => {
    const request = axios.delete(`${baseUrl}/${id}`)
    return request.then(response => response.data)
}

export default {create, getAll, update, removeUser}