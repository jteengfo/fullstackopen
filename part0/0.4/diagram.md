```mermaid
sequenceDiagram
    participant browser
    participant server

    browser->>server: POST https://studies.cs.helsinki.fi/exampleapp/new_notes
    activate server
    Note left of server: activating server simply means that the request is being processed. 
    server->>browser: 302 Redirect Status Code with Location: '/exampleapp/notes'
    deactivate server
    Note left of server: deactivating server simply means the request has finished processing and not being entertained by the server any longer.

    browser->>server: GET https://studies.cs.helsinki.fi/exampleapp/notes
    activate server
    server->>browser: HTML Document
    deactivate server

    browser->>server: GET https://studies.cs.helsinki.fi/exampleapp/main.css
    activate server
    server->>browser: CSS file
    deactivate server

    browser->>server: GET https://studies.cs.helsinki.fi/exampleapp/main.js
    activate server
    server->>browser: JS file
    deactivate server
    Note left of server: The browser starts executing code inside JS that fetches the JSON file from the server

    browser->>server: GET https://studies.cs.helsinki.fi/exampleapp/data.json
    activate server
    server->>browser: JSON file
    deactivate server
    Note left of server: the browser executes the callback function (in main.js) that renders the notes including the new note
    

    
