"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const list_1 = __importDefault(require("./routes/list"));
const body_parser_1 = __importDefault(require("body-parser"));
require("dotenv").config();
console.log(process.env.PORT);
const app = (0, express_1.default)();
let apicache = require('apicache');
let cache = apicache.middleware;
// Decide whether to use the PORT and MONGO_URI from HEAD or origin/main
const PORT = process.env.PORT;
const MONGO_URI = process.env.MONGO_URI;
if (!MONGO_URI) {
    throw new Error("MONGO_URI is not defined in the environment variables");
}
const favSchema = new mongoose_1.default.Schema({
    itemId: String,
    itemType: String
});
const userSchema = new mongoose_1.default.Schema({
    userId: {
        type: String,
        require: true,
        unique: true
    },
    favorites: [favSchema]
}, { collection: 'MyOTT',
    timestamps: true,
    toJSON: {
        transform: (doc, ret) => {
            delete ret._id;
            delete ret.__v;
            delete ret.createdAt;
            delete ret.updatedAt;
        }
    }
});
const User = mongoose_1.default.model('User', userSchema);
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
app.get('/api/users', cache('5 minutes'), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const allDbUsers = yield User.find({});
    try {
        res.json(allDbUsers);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch users' });
    }
}));
app.route('/api/users/:userId')
    .get(cache('5 minutes'), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield User.findOne({ userId: req.params.userId });
        if (user) {
            res.json(user);
        }
        else {
            res.status(404).json({ error: 'User not found' });
        }
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch user' });
    }
}))
    .put((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.params;
    const newFavorite = {
        itemId: req.body['favorites[itemId]'],
        itemType: req.body['favorites[itemType]'],
    };
    try {
        const user = yield User.findOne({ userId });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        const itemExists = user.favorites.some((favorite) => favorite.itemId === newFavorite.itemId);
        if (itemExists) {
            return res.status(409).json({ error: 'Favorite item already exists' });
        }
        user.favorites.push(newFavorite);
        yield user.save();
        res.json({ message: 'User favorites updated successfully', user });
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to update user favorites' });
    }
}))
    .patch((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = String(req.params.userId);
    const updatedUserId = req.body.newUserId;
    try {
        const user = yield User.findOneAndUpdate({ userId: id }, { userId: updatedUserId }, { new: true });
        if (user) {
            res.json({ message: 'User ID updated successfully', user });
        }
        else {
            res.status(404).json({ error: 'User not found' });
        }
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to update user ID' });
    }
}))
    .delete((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.params;
    try {
        const user = yield User.findOneAndDelete({ userId });
        if (user) {
            res.json({ message: 'User deleted successfully' });
        }
        else {
            res.status(404).json({ error: 'User not found' });
        }
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to delete user' });
    }
}));
app.post('/api/users', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId, favorites } = req.body;
    if (!userId) {
        return res.status(400).json({ error: 'userId is required' });
    }
    try {
        const existingUser = yield User.findOne({ userId });
        if (existingUser) {
            return res.status(409).json({ error: 'User with this userId already exists' });
        }
        const newUser = new User({
            userId,
            favorites: Array.isArray(favorites)
                ? favorites.map((favorite) => ({
                    itemId: favorite.itemId,
                    itemType: favorite.itemType,
                }))
                : [],
        });
        yield newUser.save();
        res.status(201).json(newUser);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to create user' });
    }
}));
app.delete('/api/users/:userId/favorites/:itemId', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId, itemId } = req.params;
    try {
        const user = yield User.findOne({ userId });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        const favoriteIndex = user.favorites.findIndex((favorite) => favorite.itemId === itemId);
        if (favoriteIndex === -1) {
            return res.status(404).json({ error: 'Favorite item not found' });
        }
        user.favorites.splice(favoriteIndex, 1);
        yield user.save();
        res.json({ message: 'Favorite item deleted successfully' });
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to delete favorite item' });
    }
}));
// Start the server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
exports.default = app;
