"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
const list_1 = __importDefault(require("./routes/list"));
const node_cache_1 = __importDefault(require("node-cache"));
const body_parser_1 = __importDefault(require("body-parser"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const cache = new node_cache_1.default({ stdTTL: 100, checkperiod: 120 });
const fs = require('fs');
let users = [];
// Load the users data from MOCK_DATA.json file
fs.readFile('/home/runner/MyListOTT/MOCK_DATA.json', 'utf8', (err, data) => {
    if (err) {
        console.error('Error reading data file:', err.message);
        return;
    }
    users = JSON.parse(data);
    console.log('Data loaded successfully:'); // Log the loaded data
});
console.log('__dirname:', __dirname);
// Decide whether to use the PORT and MONGO_URI from HEAD or origin/main
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb+srv://shivamshukla21:8wvEUr69ekesBih@clustermyott.zfnj6um.mongodb.net/?retryWrites=true&w=majority&appName=ClusterMyOTT';
// Middleware
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: false }));
app.use(body_parser_1.default.json());
app.use(body_parser_1.default.urlencoded({ extended: true }));
// Connect to MongoDB
mongoose_1.default.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error(err));
// Add the list routes
app.use('/api/list', list_1.default);
// Root route handler
app.get('/', (req, res) => {
    res.send('Welcome to My List API for OTT Platform!');
});
app.get('/api/users', (req, res) => {
    // Assuming 'users' contains the user data
    return res.json(users);
});
app.route('/api/users/:userId')
    .get((req, res) => {
    const id = String(req.params.userId);
    const user = users.find((user) => user.userId === id);
    if (user) {
        return res.json(user);
    }
    else {
        return res.status(404).json({ error: 'User not found' });
    }
})
    .put((req, res) => {
    const { userId } = req.params;
    const newUserId = req.body['userId'];
    const newFavorite = {
        itemId: req.body['favorites[itemId]'],
        itemType: req.body['favorites[itemType]'],
    };
    if (!userId) {
        return;
    }
    // Find the user by userId
    const userIndex = users.findIndex((user) => user.userId === userId);
    if (userIndex === -1) {
        return res.status(404).json({ error: 'User not found' });
    }
    // Ensure favorites is an array before checking
    if (!Array.isArray(users[userIndex].favorites)) {
        users[userIndex].favorites = [];
    }
    // Check if the itemId already exists in the favorites array
    const itemExists = users[userIndex].favorites.some((favorite) => favorite.itemId === newFavorite.itemId);
    if (itemExists) {
        return res.status(409).json({ error: 'Favorite item already exists' });
    }
    // Append the new favorite item to the array
    users[userIndex].favorites.push(newFavorite);
    // Check if the newUserId already exists
    const existingUserIndex = users.findIndex((user) => user.userId === newUserId);
    if (existingUserIndex === -1 || existingUserIndex === userIndex) {
        if (newUserId) {
            users[userIndex].userId = newUserId;
        }
    }
    // Write the updated users array back to the MOCK_DATA.json file
    fs.writeFile('./MOCK_DATA.json', JSON.stringify(users, null, 2), (err) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to update user favorites' });
        }
        return res.json({ message: 'User favorites updated successfully', user: users[userIndex] });
    });
})
    .delete((req, res) => {
    const { userId } = req.params;
    // Assuming userId is passed as a URL parameter
    // Find the index of the user with the given userId
    const userIndex = users.findIndex((user) => user.userId === userId);
    if (userIndex === -1) {
        // If the user is not found, return a 404 error
        return res.status(404).json({ error: 'User not found' });
    }
    // Remove the user from the array
    users.splice(userIndex, 1);
    fs.writeFile('./MOCK_DATA.json', JSON.stringify(users, null, 2), (err) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to delete user' });
        }
        // Return a success response
        return res.json({ message: 'User deleted successfully' });
    });
});
app.post('/api/users', (req, res) => {
    const { userId, favorites } = req.body;
    // Validate required fields
    if (!userId) {
        return res.status(400).json({ error: 'userId is required' });
    }
    // Check if userId already exists
    const existingUserIndex = users.findIndex((user) => user.userId === userId);
    if (existingUserIndex !== -1) {
        return res.status(409).json({ error: 'User with this userId already exists' });
    }
    // Create new user object
    const newUser = {
        userId,
        favorites: Array.isArray(favorites) ? favorites.map((favorite) => ({
            itemId: favorite.itemId,
            itemType: favorite.itemType,
        })) : []
    };
    // Add new user to users array
    users.push(newUser);
    // Write the updated users array back to the MOCK_DATA.json file
    fs.writeFile('./MOCK_DATA.json', JSON.stringify(users, null, 2), (err) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to create user' });
        }
        // Return a success response
        return res.status(201).json({ message: 'User created successfully', user: newUser });
    });
});
app.delete('/api/users/:userId/favorites/:itemId', (req, res) => {
    const { userId, itemId } = req.params;
    // Find the index of the user with the given userId
    const userIndex = users.findIndex((user) => user.userId === userId);
    if (userIndex === -1) {
        // If the user is not found, return a 404 error
        return res.status(404).json({ error: 'User not found' });
    }
    // Ensure favorites is an array before proceeding
    if (!Array.isArray(users[userIndex].favorites)) {
        return res.status(404).json({ error: 'Favorites list not found for user' });
    }
    // Find the index of the favorite item with the given itemId
    const favoriteIndex = users[userIndex].favorites.findIndex((favorite) => favorite.itemId === itemId);
    if (favoriteIndex === -1) {
        // If the favorite item is not found, return a 404 error
        return res.status(404).json({ error: 'Favorite item not found' });
    }
    // Remove the favorite item from the array
    users[userIndex].favorites.splice(favoriteIndex, 1);
    // Write the updated users array back to the MOCK_DATA.json file
    fs.writeFile('./MOCK_DATA.json', JSON.stringify(users, null, 2), (err) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to delete favorite item' });
        }
        return res.json({ message: 'Favorite item deleted successfully' });
    });
});
// Start the server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
exports.default = app;
