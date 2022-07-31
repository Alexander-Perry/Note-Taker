// set requirements
const express = require('express');
const path = require('path');
const noteData = require('./db/db.json');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
// const uuid = require('./helpers/uuid');

// use express
const app = express();
const PORT = process.env.port || 3001;
// use static refs
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Navitage to index.html
app.get('/', (req, res) => res.send('navigate to index.html'));

// Listen for /notes and navigate to /public/notes.html
app.get('/notes', (req, res) => res.sendFile(path.join(__dirname, 'public/notes.html')));

// GET /api/notes - read db.json and return data
app.get('/api/notes', (req, res) => {
    fs.readFile('./db/db.json', 'utf8', (err, data) => {
        if (err) {
            console.error(err);
        } else {
            const notes = JSON.parse(data);
            return res.json(notes);
        };
    });
});

// POST /api/notes - read existing db.json data, add new entry
app.post('/api/notes', (req, res) => {
    console.log('req.body:', req.body);
    const { title, text } = req.body;
    if (title && text) {
        const newNote = { 'id': uuidv4(), title, text };
        const response = {
            status: 'success',
            data: newNote,
        };
        console.log(response);
        // read existing db.json data
        fs.readFile('./db/db.json', 'utf8', (err, data) => {
            if (err) {
                console.error(err);
            } else {
                const notes = JSON.parse(data);
                // add new note to data
                notes.push(newNote);
                // write new combined data to db.json
                fs.writeFile('./db/db.json', JSON.stringify(notes), (err) =>
                    err ? console.error(err) : console.info('Note Saved')
                );
            }
        });
        res.status(201).json(response);
    } else {
        res.status(500).json('Error');
    };

});

// DELETE /api/notes - read existing db.json data, find object by id, remove it, and rewrite the JSON
app.delete('/api/notes/:id', (req, res) => {
    console.log('Delete: req.body:', req.body);
    console.log('Delete: req.params:', req.params);
    console.log('Delete: req.params.id:', req.params.id);
    // res.send('success');

    const id = req.params.id;
    fs.readFile('./db/db.json', 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            // res.status blah
        } else {
            const notes = JSON.parse(data);
            console.log('notes', notes);
            const filteredNotes = notes.filter(index => index.id != id);
            fs.writeFile('./db/db.json', JSON.stringify(filteredNotes), (err) =>
                err ? console.error(err) : console.info('Updated Notes')
            );
            res.status(200).json(`${id} removed`);
        };
    });
});


//         // add new note to data

//         // notes.push(newNote); 
//         // write new combined data to db.json
//         // fs.writeFile('./db/db.json', JSON.stringify(notes), (err) =>
//             // err ? console.error(err) : console.info('Note Saved')
//         // );
//     }
// });


// Wildcard listener for invalid URL
app.get('*', (req, res) => res.sendFile(path.join(__dirname, 'public/index.html')));

// Initialise server
app.listen(PORT, () => console.log('Listening on Port 3001'));


// GET /api/notes should read the db.json file and return all saved notes as JSON.
// POST / api / notes should receive a new note to save on the request body, add it to the db.json file, and then return the new note to the client.
// You'll need to find a way to give each note a unique id when it's saved(look into npm packages that could do this for you).

// AS A small business owner
// I WANT to be able to write and save notes
// SO THAT I can organize my thoughts and keep track of tasks I need to complete

// GIVEN a note-taking application
// WHEN I open the Note Taker
// THEN I am presented with a landing page with a link to a notes page

// WHEN I click on the link to the notes page
// THEN I am presented with a page with existing notes listed in the left-hand column, plus empty fields to enter a new note title and the note’s text in the right-hand column

// WHEN I enter a new note title and the note’s text
// THEN a Save icon appears in the navigation at the top of the page

// WHEN I click on the Save icon
// THEN the new note I have entered is saved and appears in the left-hand column with the other existing notes

// WHEN I click on an existing note in the list in the left-hand column
// THEN that note appears in the right-hand column

// WHEN I click on the Write icon in the navigation at the top of the page
// THEN I am presented with empty fields to enter a new note title and the note’s text in the right-hand column
