"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// src/models/user.ts
const mongoose_1 = require("mongoose");
const userSchema = new mongoose_1.Schema({
    username: { type: String, required: true },
    password: { type: String, required: true },
    preferences: {
        favoriteGenres: [{ type: String }],
        dislikedGenres: [{ type: String }]
    },
    watchHistory: [
        {
            contentId: { type: String },
            watchedOn: { type: Date },
            rating: { type: Number }
        }
    ],
    favorites: [
        {
            itemId: { type: String },
            itemType: { type: String }
        }
    ]
});
exports.default = (0, mongoose_1.model)('User', userSchema);
