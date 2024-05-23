"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const listSchema = new mongoose_1.Schema({
    userId: { type: String, required: true },
    items: [{ itemId: { type: String }, itemType: { type: String } }],
    favorites: [{ itemId: { type: String }, itemType: { type: String } }]
});
exports.default = (0, mongoose_1.model)('List', listSchema);
