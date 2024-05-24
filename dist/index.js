"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/index.ts
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
const list_1 = __importDefault(require("./routes/list"));
const auth_1 = __importDefault(require("./routes/auth")); // Import auth routes
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'your_mongo_uri';
app.use(express_1.default.json());
mongoose_1.default.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error(err));
app.use(express_1.default.static(path_1.default.join(__dirname, '../frontend/build')));
app.get('/', (req, res) => {
    res.send('Welcome to My List API!');
});
app.use('/api/list', list_1.default);
app.use('/api/auth', auth_1.default); // Use auth routes
app.get('*', (req, res) => {
    res.sendFile(path_1.default.join(__dirname, '../frontend/build', 'index.html'));
});
if (process.env.NODE_ENV !== 'test') {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}
exports.default = app;
