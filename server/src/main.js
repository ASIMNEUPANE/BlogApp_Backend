require("dotenv").config();
var express = require("express");
var app = express();
var PORT = parseInt(process.env.PORT || '3333');
app.get('/', function (req, res) {
    res.send('Hello, TypeScript with Express!');
});
app.listen(PORT, function () {
    console.log("Server is running at http://localhost:".concat(PORT));
});
