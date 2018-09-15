#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var bodyParser = require("body-parser");
var cors = require("cors");
var saver_1 = require("./saver");
var args = process.argv.slice(2);
var port = 3000;
if (args.length >= 2 && args[0] === '-p') {
    port = parseInt(args[1]);
}
;
if (isNaN(port)) {
    console.error('Port should be a number');
    process.exit(1);
}
var app = express();
app.use(cors());
app.use(bodyParser.json());
app.post('/writeFile', function (req, res) {
    var _a = req.body, fileName = _a.fileName, code = _a.code, testsFolder = _a.testsFolder;
    return saver_1.save(fileName, code, testsFolder)
        .then(function () {
        res.sendStatus(200);
    })
        .catch(function (e) {
        console.error('During saving next error occured: ', e, ' \n Return 500 with error description');
        res.status(500).send({ error: e.message });
    });
});
app.listen(port, function () { return console.log("Flashtest server listening on port " + port + "!"); });
