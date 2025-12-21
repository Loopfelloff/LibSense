"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require('express');
const app = express();
let port = 5000;
app.get('/home', (req, res) => {
    console.log(`the request is coming form ${req.url}`);
    return res.json('hi how are you mate');
});
app.get('/house', (req, res) => {
    console.log(`the request is coming form ${req.url}`);
    return res.json('hi from house');
});
app.listen(port, () => {
    console.log('Listening to port ', port);
});
//# sourceMappingURL=index.js.map