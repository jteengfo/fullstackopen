```mermaid

sequenceDiagram
    participant browser
    participant server

    browser->>server: POST https://studies.cs.helsinki.fi/exampleapp/new_note_spa
    activate server
    server->>browser: Status code: 201 Created
    deactivate server
    note left of server: the event handler in the JS code is then executed by the browser, creating a new note, adding it to the notes list, and rerendering the note list on the page.