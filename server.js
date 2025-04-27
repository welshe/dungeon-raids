require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const db = require('./firebaseConfig'); // Firebase setup
const Hero = require('./hero');
const Dungeon = require('./dungeon');

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });

app.use(express.json());

const PORT = process.env.PORT || 3000;

// Basic server check endpoint
app.get('/', (req, res) => {
    res.send('Multiplayer Dungeon Raids API is running!');
});

// Save hero data in Firebase
app.post('/saveHero', (req, res) => {
    const { name, level, hp, attack } = req.body;
    const hero = { name, level, hp, attack };

    db.ref(`heroes/${hero.name}`).set(hero)
        .then(() => res.json({ message: "Hero saved successfully!", hero }))
        .catch((error) => res.status(500).json({ message: "Error saving hero", error }));
});

// Retrieve hero data from Firebase
app.get('/getHero/:name', (req, res) => {
    const heroName = req.params.name;

    db.ref(`heroes/${heroName}`).once('value')
        .then(snapshot => {
            if (snapshot.exists()) {
                res.json(snapshot.val());
            } else {
                res.status(404).json({ message: "Hero not found!" });
            }
        })
        .catch(error => res.status(500).json({ message: "Error retrieving hero", error }));
});

// API route for AI-driven dungeon raids
app.post('/raid', (req, res) => {
    const { heroName, heroLevel, dungeonName, dungeonDifficulty } = req.body;

    const hero = new Hero(heroName, heroLevel);
    const dungeon = new Dungeon(dungeonName, dungeonDifficulty);
    const result = hero.raidDungeon(dungeon);

    res.json(result);
});

// WebSocket logic for multiplayer interactions
io.on('connection', (socket) => {
    console.log(`Player connected: ${socket.id}`);

    // Guild chat messaging system
    socket.on('sendMessage', (msg) => {
        io.emit('receiveMessage', msg); // Broadcasts message to all connected players
    });

    // Handle multiplayer dungeon raids
    socket.on('startRaid', (data) => {
        const hero = new Hero(data.heroName, data.heroLevel);
        const dungeon = new Dungeon(data.dungeonName, data.dungeonDifficulty);
        const result = hero.raidDungeon(dungeon);

        io.emit('raidResult', result); // Shares raid result with all players
    });

    socket.on('disconnect', () => {
        console.log(`Player disconnected: ${socket.id}`);
    });
});

// Start the server
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
