var express = require("express");
var app = express();
var PORT = 3000;
app.get('/', function (req, res) {
    res.send('Hello, TypeScript with Express!');
});
app.listen(PORT, function () {
    console.log("Server is running at http://localhost:".concat(PORT));
});
