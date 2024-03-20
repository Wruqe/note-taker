const express = require('express');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

// Initialize the app and create a port
const app = express();
const PORT = process.env.PORT || 3001;

// Set up body parsing, static, and route middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// Route to get all notes
app.get('/api/notes', (req, res) => {
    fs.readFile('./db/db.json', 'utf-8', (err, data) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Failed to read notes data.' });
        }
        const myNotes = JSON.parse(data);
        res.json(myNotes);
    });
});

// Route to save a new note
app.post('/api/notes', (req, res) => {
    const newNote = req.body;
    newNote.id = uuidv4(); // Assign a unique id using uuidv4

    fs.readFile('./db/db.json', 'utf-8', (err, data) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Failed to read notes data.' });
        }
        const myNotes = JSON.parse(data);
        myNotes.push(newNote);

        fs.writeFile('./db/db.json', JSON.stringify(myNotes), (err) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: 'Failed to write note data.' });
            }
            res.json(newNote);
        });
    });
});

// Route to serve the homepage
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/index.html'));
});

// Route to serve the notes page
app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/notes.html'));
});

// Catch-all route for any other requests, redirect to homepage
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/index.html'));
});

// Start the server on the port
app.listen(PORT, () => console.log(`Listening on PORT: ${PORT}`));
