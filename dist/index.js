"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
const list_1 = __importDefault(require("./routes/list"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const usersPath = path_1.default.resolve(__dirname, '../../MOCK_DATA.json');
const users = require(usersPath);
// Decide whether to use the PORT and MONGO_URI from HEAD or origin/main
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb+srv://shivamshukla21:8wvEUr69ekesBih@clustermyott.zfnj6um.mongodb.net/?retryWrites=true&w=majority&appName=ClusterMyOTT';
// Middleware
app.use(express_1.default.json());
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
// Start the server if not in test environment
if (process.env.NODE_ENV !== 'test') {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}
exports.default = app;
