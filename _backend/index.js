"use strict";

const http = require('http');
const express = require('express');
const fs = require('fs');
const path = require('path');
const log4js = require('log4js');
const bodyParser = require('body-parser');
const Chance = require('chance'), chance = new Chance();

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


var BACKEND = {};

BACKEND["wito"] = {
    meta: {
        uid: "wito",
        username: "witold z",
        created_time: new Date(),
        last_updated_time: null,
    },
    callendar_begin: "01/01/2016",
    callendar_end: "02/01/2017",
    opts: {
        leave_days: 39,
        from: null,
        to: "12/31/2016",
        start_in_the_mid_week: false,
        finish_in_the_mid_week: false,
        holiday_on_sat_extends_holiday: true,
        do_not_overlap_with_blacklist_days: true
    },
    holidays_taken: [
        {
            type: "holiday",
            from: "1/1/2015",
            to: "1/3/2015",
            comment: "Rybka lubi plywac",
            unpaid: false,
            on_demand: false,
            show: true
        },
        {
            type: "holiday",
            from: "1/14/2015",
            to: "2/18/2015",
            comment: "Wyjazd do Afganistanu",
            unpaid: true,
            on_demand: false,
            show: false
        },
        {
            type: "holiday",
            from: "4/14/2015",
            to: "4/14/2015",
            comment: "Urlop na zadanie. Chlanie ze Zbyszkiem",
            unpaid: false,
            on_demand: true,
            show: true
        },
        {
            type: "blacklist",
            from: "07/11/2015",
            to: "07/12/2015",
            comment: "Ślub Marka i Iwony",
            show: true
        },
        {
            type: "blacklist",
            from: "08/18/2015",
            to: "08/18/2015",
            comment: "Imieniny Taty",
            show: true
        }
    ],
    show_blacklist_days: true,
    selected_drange: null,
    selected_leave_days: 20
};

function user_data_default(uid) {
    return {
        meta: {
            uid: uid,
            username: null,
            locale: null,
            created_time: new Date(),
            last_updated_time: null,
            last_updated_ip: null,
        },
        country: "poland",
        callendar_begin: "01/01/2016",
        callendar_end: "02/01/2017",
        opts: {
            leave_days: 26,
            from: null,
            to: "12/31/2016",
            start_in_the_mid_week: false,
            finish_in_the_mid_week: false,
            holiday_on_sat_extends_holiday: true,
            do_not_overlap_with_blacklist_days: true
        },
        show_blacklist_days: false,
        holidays_taken: [],
        selected_drange: null,
        selected_leave_days: 15
    };
}

app.post('/user/:uid', function (req, res, next) {

    var uid = req.params.uid;

    console.log("getting user profile", uid);

    if (BACKEND[uid] === undefined) {
        res.json(user_data_default(uid));
    } else {
        res.json(BACKEND[uid]);
    }

});

app.post('/user/remove/:id', function (req, res, next) {
    var uid = req.params.id;
    console.log("removing user profile", uid);
    delete BACKEND[uid];

    res.send({
        "uid": uid,
        "rc": result.rowCount
    });

});

app.post('/user/save/:id', function (req, res, next) {
    var uid = req.params.id;

    console.log("saving user profile", uid);

    if (uid == "new") {
        uid = chance.word({length: 10});
        console.log("creating new user", uid);
    }

    var user = JSON.parse(req.body);
    user.meta.uid = uid;
    user.meta.last_updated_time = new Date();

    BACKEND[uid] = user;

    res.send({
        "uid": uid,
    });

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
