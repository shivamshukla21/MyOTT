const express = require("express");
const users = require("./MOCK_DATA.json");

const app = express();
const PORT = 5000;

app.get("api/users", (req, res) => {
  return res.json(users);
});

app.listen(PORT, () => console.log('Started My OTT Server'));