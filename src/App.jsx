import { useState, useEffect, useMemo } from 'react'
import NoteList from './components/NoteList'
import NoteEditor from './components/NoteEditor'
import { getMobisleNotes } from './services/MobisleService'

function App() {
  const [notes, setNotes] = useState([])
  const [selectedNote, setSelectedNote] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [showMobisle, setShowMobisle] = useState(false)

  // Load notes from localStorage on component mount
  useEffect(() => {
    const savedNotes = localStorage.getItem('notes')
    if (savedNotes) {
      setNotes(JSON.parse(savedNotes))
    }
  }, [])

  // Save notes to localStorage whenever notes change
  useEffect(() => {
    localStorage.setItem('notes', JSON.stringify(notes))
  }, [notes])

  const mobisleNotes = useMemo(() => getMobisleNotes(), [])

  const filteredNotes = useMemo(() => {
    const combined = showMobisle ? [...notes, ...mobisleNotes] : notes;
    if (!searchQuery) return combined;

    const query = searchQuery.toLowerCase();
    return combined.filter(n =>
      n.title.toLowerCase().includes(query) ||
      n.content.toLowerCase().includes(query) ||
      (n.folder && n.folder.toLowerCase().includes(query))
    );
  }, [notes, mobisleNotes, searchQuery, showMobisle]);

  const addNote = (title, content) => {
    const newNote = {
      id: Date.now().toString(),
      title: title || 'Untitled Note',
      content: content || '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    setNotes([newNote, ...notes])
    setSelectedNote(newNote)
  }

  const updateNote = (id, title, content) => {
    if (id.toString().startsWith('mobisle')) {
      // Optional: Allow editing Mobisle notes by saving them to local notes
      alert("Mobisle notes are read-only in this view. Copy to a new note to edit.");
      return;
    }
    setNotes(notes.map(note =>
      note.id === id
        ? { ...note, title, content, updatedAt: new Date().toISOString() }
        : note
    ))
  }

  const deleteNote = (id) => {
    if (id.toString().startsWith('mobisle')) return;
    setNotes(notes.filter(note => note.id !== id))
    if (selectedNote && selectedNote.id === id) {
      setSelectedNote(null)
    }
  }

  const selectNote = (note) => {
    setSelectedNote(note)
  }

  const createNewNote = () => {
    setSelectedNote(null)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <header className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">ACGI AI Notes & Archive</h1>
            <p className="text-gray-600">Local notes synchronized with Mobisle Archive</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              placeholder="Search all notes..."
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button
              onClick={() => setShowMobisle(!showMobisle)}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${showMobisle ? 'bg-orange-500 text-white' : 'bg-gray-200 text-gray-700'
                }`}
            >
              {showMobisle ? 'Hide Archive' : 'Show Mobisle Archive'}
            </button>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Sidebar with note list */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-gray-800">
                  {showMobisle ? 'Combined Notes' : 'Your Local Notes'}
                  <span className="ml-2 text-sm font-normal text-gray-500">({filteredNotes.length})</span>
                </h2>
                <button
                  onClick={createNewNote}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
                >
                  + New Note
                </button>
              </div>
              <NoteList
                notes={filteredNotes}
                selectedNote={selectedNote}
                onSelectNote={selectNote}
                onDeleteNote={deleteNote}
              />
            </div>
          </div>

          {/* Main editor area */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <NoteEditor
                note={selectedNote}
                onSave={selectedNote ? updateNote : addNote}
                onDelete={selectedNote && !selectedNote.isMobisle ? () => deleteNote(selectedNote.id) : null}
              />
              {selectedNote?.isMobisle && (
                <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded text-blue-800 text-sm">
                  <strong>Archive Note:</strong> This note is from your Mobisle backup folder: <em>{selectedNote.folder}</em>.
                  It is currently read-only.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
