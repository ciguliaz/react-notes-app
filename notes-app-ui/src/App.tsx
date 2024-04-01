import { useEffect, useState } from 'react';
import './App.css';

type Note = {
  id: number;
  title: string;
  content: string;
}

const App = () => {
  const [notes, setNotes] = useState<Note[]>([])

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/notes');
        const notes: Note[] = await res.json()
        setNotes(notes)
      } catch (error) {
        console.log(error)
      }
    }
    fetchNotes()
  }, [])

  const handleNoteClick = (note: Note) => {
    setSelectedNote(note);
    setTitle(note.title)
    setContent(note.content)
  }


  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:5000/api/notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, content })
      })
      const newNote = await res.json()
      setNotes([newNote, ...notes])
      setTitle("")
      setContent("")
    } catch (error) {
      console.log(error)
    }



  }

  const handleUpdateNote = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedNote) {
      return;
    }

    try {
      const res = await fetch(
        `http://localhost:5000/api/notes/${selectedNote.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ title, content })
        }
      )
      const updatedNote = await res.json();
      const updatedNoteList = notes.map((note) =>
        note.id === selectedNote.id ? updatedNote : note
      )
      setNotes(updatedNoteList)
      setTitle("")
      setContent("")
      setSelectedNote(null)
    } catch (error) {
      console.log(error)
    }
  }

  const handleCancel = () => {
    setTitle("")
    setContent("")
    setSelectedNote(null)
  }

  const deleteNote = async (event: React.MouseEvent, noteID: number) => {
    event.stopPropagation();

    try {
      const res = await fetch(
        `http://localhost:5000/api/notes/${noteID}`,
        {
          method: "DELETE"
        }
      )
      const updatedNotes = notes.filter((note) => note.id !== noteID);
      setNotes(updatedNotes);
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div className='app-container'>
      <form
        className='note-form'
        onSubmit={selectedNote ? handleUpdateNote : handleAddNote}
      >
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder='title'
          required
        />
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder='content...'
          rows={8}
          required
        />
        {
          selectedNote ? (
            <div className='edit-buttons'>
              <button type='submit'>Save</button>
              <button onClick={handleCancel}>Cancel</button>
            </div>
          ) : (<button type='submit'>Add note</button>)
        }
      </form>
      <div className='notes-grid'>
        {
          notes.map(note => (
            <div className='note-item' onClick={() => handleNoteClick(note)}>
              <div className='notes-header'>
                <button onClick={(event) => deleteNote(event, note.id)}>x</button>
              </div>
              <h2>{note.title}</h2>
              <p>{note.content}</p>
            </div>
          ))
        }

      </div>
    </div>
  );
}

export default App;
