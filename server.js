// set requirements
const express = require('express');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

// Express.js
const app = express();
const PORT = process.env.port || 3001;
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Read JSON file function
function readJSON() {
    return fs.readFileSync('./db/db.json', 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            return error;
        } else {
            return data;
        }
    });
};

// Write JSON file function
function writeJSON(data) {
    // Error handling - check 'data' exists before writing file. 
    data
        ?
        fs.writeFile('./db/db.json', JSON.stringify(data), (err) =>
            err ? console.error(err) : console.info('Success'))
        : console.log('Invalid Data');
};

// Navitage to index.html
app.get('/', (req, res) => res.send('index.html'));

// Listen for /notes and navigate to /public/notes.html
app.get('/notes', (req, res) => res.sendFile(path.join(__dirname, 'public/notes.html')));

// GET /api/notes - read db.json via readJSON function and return data
app.get('/api/notes', (req, res) => {
    const notes = JSON.parse(readJSON());
    return res.json(notes);
});

// POST /api/notes - read existing db.json data, add new entry
app.post('/api/notes', (req, res) => {
    const { title, text } = req.body;
    if (title && text) {
        const newNote = { 'id': uuidv4(), title, text };
        const response = { status: 'success', data: newNote };
        const notes = JSON.parse(readJSON());
        // Add new note to the array
        notes.push(newNote);
        // write to JSON file
        writeJSON(notes);
        // return status 201 with response
        res.status(201).json(response);
    } else {
        // return status 500 with response Error
        res.status(500).json('Invalid request');
    };
});

// DELETE /api/notes - read existing db.json data, find object by id, remove it, and rewrite the JSON
app.delete('/api/notes/:id', (req, res) => {
    const { id } = req.params;
    const notes = JSON.parse(readJSON());
    // Filter notes, excluding the result with id from the parameter. 
    const filteredNotes = notes.filter(index => index.id != id);
    // update the JSON data. 
    writeJSON(filteredNotes);
    res.status(200).json(`${id} removed`);
});

// Wildcard listener for invalid URL -> send index file
app.get('*', (req, res) => res.sendFile(path.join(__dirname, 'public/index.html')));

// Initialise server
app.listen(PORT, () => console.log('Listening on Port 3001'));

