"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const list_1 = __importDefault(require("./routes/list"));
const app = (0, express_1.default)();
const PORT = 5000;
const MONGO_URI = 'mongodb+srv://shivamshukla21:8wvEUr69ekesBih@clustermyott.zfnj6um.mongodb.net/?retryWrites=true&w=majority&appName=ClusterMyOTT';
// Middleware
app.use(express_1.default.json());
// Routes
app.use('/api/list', list_1.default);
// Database Connection
mongoose_1.default.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error(err));
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
exports.default = app; // Make sure to export the app for testing purposes
