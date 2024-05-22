"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const movieSchema = new mongoose_1.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    genres: [{ type: String, required: true }],
    releaseDate: { type: Date, required: true },
    director: { type: String, required: true },
    actors: [{ type: String, required: true }]
});
exports.default = (0, mongoose_1.model)('Movie', movieSchema);
