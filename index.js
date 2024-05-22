// "use strict";
// Object.defineProperty(exports, "__esModule", { value: true });
// const express_1 = require("express");
// const mongoose_1 = require("mongoose");
// const list_1 = require("./routes/list");

// const app = (0, express_1.default)();
// const PORT = process.env.PORT || 5000;

// // Middleware
// app.use(express_1.default.json());

// // Routes
// app.use('/api/list', list_1.default);

// // Database Connection
// const MONGO_URI = 'your_mongodb_connection_string';
// mongoose_1.default.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
//     .then(() => console.log('MongoDB connected'))
//     .catch(err => console.error(err));

// app.listen(PORT, () => {
//     console.log(`Server running on port ${PORT}`);
// });
