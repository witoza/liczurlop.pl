"use strict";

const http = require('http');
const express = require('express');
const fs = require('fs');
const path = require('path');
const log4js = require('log4js');
const bodyParser = require('body-parser');

const logger = log4js.getLogger();

String.prototype.startsWithAny = function () {
    return Array.prototype.some.call(arguments, arg => this.startsWith(arg));
};

String.prototype.endsWithAny = function () {
    return Array.prototype.some.call(arguments, arg => this.endsWith(arg));
};

const app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

var req_id = 0;

function is_req_static(req) {
    var url = req.originalUrl;

    var is_resource_static =
        url === "/" ||
        url.startsWithAny("/_bc/", "/_pc/", "/.well-known/") ||
        url.endsWithAny("js", "jpg", "ico", "png", "css", "html");

    return is_resource_static;
}

app.use('/', function (req, res, next) {

    if (is_req_static(req)) {
        next();
        return;
    }

    req_id++;
    req.req_id = req_id + "]";

    logger.info(req.req_id, "-----------------------------------");

    logger.info(req.req_id, ">", req.method, req.originalUrl);
    if (Object.keys(req.body).length > 0) {
        logger.info(req.req_id, "body:", req.body);
    }
    res.on('finish', function () {
        logger.info(req.req_id, "<", res.statusCode);
    });
    next();
});

const program = require('commander');

program
    .option('-d, --dir <dir>', 'The directory with frontend')
    .parse(process.argv);

const app_dir = program.dir || "/../_frontend/app";

app.use(express.static(__dirname + app_dir));
logger.info("Serving frontend from", __dirname + app_dir);

const http_port = program.port || 8001;
const server = http.createServer(app).listen(http_port, function () {
    logger.info("LiczUrlop backend is running at: " + http_port);
});
