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
const list_1 = __importDefault(require("../models/list"));
const router = express_1.default.Router();
// Add a favorite TV show or movie to My List
router.post('/add-favorite', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId, itemId, itemType } = req.body;
    try {
        const list = yield list_1.default.findOneAndUpdate({ userId }, { $addToSet: { favorites: { itemId, itemType } } }, { new: true, upsert: true });
        res.status(200).json({ message: 'Item added to favorites successfully', list });
    }
    catch (err) {
        if (err instanceof Error) {
            res.status(500).json({ error: err.message });
        }
        else {
            res.status(500).json({ error: 'Unknown error' });
        }
    }
}));
// Remove a favorite TV show or movie from My List
router.delete('/remove-favorite', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId, itemId } = req.body;
    try {
        const list = yield list_1.default.findOneAndUpdate({ userId }, { $pull: { favorites: { itemId } } }, { new: true });
        res.status(200).json({ message: 'Item removed from favorites successfully', list });
    }
    catch (err) {
        if (err instanceof Error) {
            res.status(500).json({ error: err.message });
        }
        else {
            res.status(500).json({ error: 'Unknown error' });
        }
    }
}));
// List favorite TV shows and movies with pagination
router.get('/favorites/:userId', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.params;
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    try {
        // Retrieve user's list of favorite items
        const list = yield list_1.default.findOne({ userId });
        if (!list) {
            return res.status(404).json({ error: 'User list not found' });
        }
        const favorites = list.favorites;
        const paginatedFavorites = favorites.slice((page - 1) * limit, page * limit);
        res.status(200).json({ favorites: paginatedFavorites }); // Ensure to return an object with 'favorites' property
    }
    catch (err) {
        if (err instanceof Error) {
            res.status(500).json({ error: err.message });
        }
        else {
            res.status(500).json({ error: 'Unknown error' });
        }
    }
}));
exports.default = router;
