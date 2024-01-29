require("dotenv").config();
const express = require("express");

const app = express();

const PORT : number = parseInt(process.env.PORT || '3333');

app.get('/', (req, res) => {
  res.send('Hello, TypeScript with Express!');
});

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});


