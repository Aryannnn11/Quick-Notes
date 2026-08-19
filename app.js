let notes = []
let editingNoteId = null


// -----------------------------
// LOAD NOTES
// -----------------------------

function loadNotes() {

  const savedNotes = localStorage.getItem('quickNotes')

  return savedNotes ? JSON.parse(savedNotes) : []
}



// -----------------------------
// SAVE NOTE
// -----------------------------

function saveNote(event) {

  event.preventDefault()

  const title = document
    .getElementById('noteTitle')
    .value
    .trim()

  const content = document
    .getElementById('noteContent')
    .value
    .trim()


  if (!title || !content) {
    return
  }


  // EDIT EXISTING NOTE

  if (editingNoteId !== null) {

    const noteIndex = notes.findIndex(
      note => note.id === editingNoteId
    )


    if (noteIndex === -1) {
      return
    }


    notes[noteIndex] = {

      ...notes[noteIndex],

      title: title,

      content: content,

      updatedAt: new Date().toISOString()

    }

  }


  // ADD NEW NOTE

  else {

    notes.unshift({

      id: generateId(),

      title: title,

      content: content,

      pinned: false,

      createdAt: new Date().toISOString(),

      updatedAt: new Date().toISOString()

    })

  }


  saveNotes()

  renderNotes()

  closeNoteDialog()
}



// -----------------------------
// GENERATE NOTE ID
// -----------------------------

function generateId() {

  return Date.now().toString()

}



// -----------------------------
// SAVE NOTES TO LOCAL STORAGE
// -----------------------------

function saveNotes() {

  localStorage.setItem(
    'quickNotes',
    JSON.stringify(notes)
  )

}



// -----------------------------
// DELETE NOTE
// -----------------------------

function deleteNote(noteId) {

  const confirmDelete = confirm(
    'Are you sure you want to delete this note?'
  )


  if (!confirmDelete) {
    return
  }


  notes = notes.filter(
    note => note.id !== noteId
  )


  saveNotes()

  renderNotes()

}



// -----------------------------
// PIN / UNPIN NOTE
// -----------------------------

function togglePin(noteId) {

  const note = notes.find(
    note => note.id === noteId
  )


  if (!note) {
    return
  }


  note.pinned = !note.pinned


  saveNotes()

  renderNotes()

}



// -----------------------------
// RENDER NOTES
// -----------------------------

function renderNotes(filteredNotes = notes) {

  const notesContainer =
    document.getElementById('notesContainer')


  if (filteredNotes.length === 0) {

    notesContainer.innerHTML = `

      <div class="empty-state">

        <div class="empty-icon">
          📝
        </div>

        <h2>No notes found</h2>

        <p>
          Create a note or try another search.
        </p>

        <button
          class="add-note-btn"
          onclick="openNoteDialog()"
        >
          + Add Your First Note
        </button>

      </div>

    `

    return

  }



  // PINNED NOTES FIRST

  const sortedNotes = [...filteredNotes].sort(
    (a, b) => {

      return (b.pinned || false) -
             (a.pinned || false)

    }
  )



  notesContainer.innerHTML =
    sortedNotes.map(note => `

      <div class="note-card ${note.pinned ? 'pinned-note' : ''}">

        <div class="note-top">

          <h3 class="note-title">

            ${escapeHTML(note.title)}

          </h3>


          <button
            class="pin-btn"
            onclick="togglePin('${note.id}')"
            title="${note.pinned ? 'Unpin Note' : 'Pin Note'}"
          >

            ${note.pinned ? '📌' : '📍'}

          </button>

        </div>


        <p class="note-content">

          ${escapeHTML(note.content)}

        </p>


        <p class="note-date">

          ${getNoteDate(note)}

        </p>


        <div class="note-actions">


          <button
            class="edit-btn"
            onclick="openNoteDialog('${note.id}')"
            title="Edit Note"
          >

            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="currentColor"
            >

              <path
                d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"
              />

            </svg>

          </button>


          <button
            class="delete-btn"
            onclick="deleteNote('${note.id}')"
            title="Delete Note"
          >

            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="currentColor"
            >

              <path
                d="M18.3 5.71c-.39-.39-1.02-.39-1.41 0L12 10.59 7.11 5.7c-.39-.39-1.02-.39-1.41 0-.39.39-.39 1.02 0 1.41L10.59 12 5.7 16.89c-.39.39-.39 1.02 0 1.41.39.39 1.02.39 1.41 0L12 13.41l4.89 4.88c.39.39 1.02.39 1.41 0 .39-.39.39-1.02 0-1.41L13.41 12l4.89-4.89c.38-.38.38-1.02 0-1.4z"
              />

            </svg>

          </button>


        </div>

      </div>

    `).join('')

}



// -----------------------------
// NOTE DATE
// -----------------------------

function getNoteDate(note) {

  if (!note.updatedAt) {

    return 'Saved note'

  }


  const date =
    new Date(note.updatedAt)


  return `Updated ${date.toLocaleDateString()} at ${date.toLocaleTimeString([], {

    hour: '2-digit',

    minute: '2-digit'

  })}`

}



// -----------------------------
// SEARCH NOTES
// -----------------------------

function searchNotes() {

  const searchText =
    document
      .getElementById('searchInput')
      .value
      .toLowerCase()
      .trim()


  const filteredNotes =
    notes.filter(note => {

      return (

        note.title
          .toLowerCase()
          .includes(searchText)

        ||

        note.content
          .toLowerCase()
          .includes(searchText)

      )

    })


  renderNotes(filteredNotes)

}



// -----------------------------
// OPEN NOTE DIALOG
// -----------------------------

function openNoteDialog(noteId = null) {

  const dialog =
    document.getElementById('noteDialog')


  const titleInput =
    document.getElementById('noteTitle')


  const contentInput =
    document.getElementById('noteContent')



  if (noteId) {

    const noteToEdit =
      notes.find(
        note => note.id === noteId
      )


    if (!noteToEdit) {
      return
    }


    editingNoteId = noteId


    document
      .getElementById('dialogTitle')
      .textContent = 'Edit Note'


    titleInput.value =
      noteToEdit.title


    contentInput.value =
      noteToEdit.content


    updateCharacterCount()

  }


  else {

    editingNoteId = null


    document
      .getElementById('dialogTitle')
      .textContent = 'Add New Note'


    titleInput.value = ''

    contentInput.value = ''


    updateCharacterCount()

  }


  dialog.showModal()

  titleInput.focus()

}



// -----------------------------
// CLOSE NOTE DIALOG
// -----------------------------

function closeNoteDialog() {

  const dialog =
    document.getElementById('noteDialog')


  dialog.close()


  editingNoteId = null

}



// -----------------------------
// CHARACTER COUNTER
// -----------------------------

function updateCharacterCount() {

  const content =
    document.getElementById('noteContent')


  const characterCount =
    document.getElementById('characterCount')


  characterCount.textContent =
    content.value.length

}



// -----------------------------
// DARK / LIGHT THEME
// -----------------------------

function toggleTheme() {

  const isDark =
    document.body.classList.toggle(
      'dark-theme'
    )


  localStorage.setItem(

    'theme',

    isDark ? 'dark' : 'light'

  )


  document
    .getElementById('themeToggleBtn')
    .textContent =
      isDark ? '☀️' : '🌙'

}



// -----------------------------
// APPLY SAVED THEME
// -----------------------------

function applyStoredTheme() {

  if (
    localStorage.getItem('theme') === 'dark'
  ) {

    document.body.classList.add(
      'dark-theme'
    )


    document
      .getElementById('themeToggleBtn')
      .textContent = '☀️'

  }

}



// -----------------------------
// PREVENT HTML INJECTION
// -----------------------------

function escapeHTML(text) {

  const div =
    document.createElement('div')


  div.textContent = text


  return div.innerHTML

}



// -----------------------------
// PAGE INITIALIZATION
// -----------------------------

document.addEventListener(
  'DOMContentLoaded',
  function () {


    applyStoredTheme()


    notes = loadNotes()


    renderNotes()



    document
      .getElementById('noteForm')
      .addEventListener(
        'submit',
        saveNote
      )



    document
      .getElementById('themeToggleBtn')
      .addEventListener(
        'click',
        toggleTheme
      )



    document
      .getElementById('searchInput')
      .addEventListener(
        'input',
        searchNotes
      )



    document
      .getElementById('noteContent')
      .addEventListener(
        'input',
        updateCharacterCount
      )



    document
      .getElementById('noteDialog')
      .addEventListener(
        'click',
        function (event) {

          if (event.target === this) {

            closeNoteDialog()

          }

        }
      )

  }
)