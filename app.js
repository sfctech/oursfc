//const fs = require('fs');
//const errorlog = require('./js/logger').errorlog;
//const successlog = require('./js/logger').successlog;

const log4js = require('log4js');
log4js.configure({
    appenders: {
        out: { type: 'stdout' },
        alllog: { type: 'file', filename: 'app.log', maxLogSize: 1048576, backups: 3, compress: true },
        errlog: { type: 'file', filename: 'error.log', maxLogSize: 1048576, backups: 3, compress: true },
        'just-errors': { type: 'logLevelFilter', appender: 'errlog', level: 'error' }
    },
    categories: {
        default: { appenders: [ 'out', 'alllog', 'just-errors' ], level: 'debug' }
    }
});
const logger = log4js.getLogger('AppConsole');

const jsdom = require('jsdom');
const { JSDOM } = jsdom;
const { window } = new JSDOM();
const { document } = (new JSDOM('')).window;
global.document = document;

var $ = jQuery = require('jquery')(window);
const express = require('express');
const app = express();
const path = require("path");
const PORT = process.env.PORT || 5000;

app.use(express.static(path.join(__dirname)));  // point to root
//app.use(express.static(path.join(__dirname + '/css')));
//app.use(express.static(path.join(__dirname + '/js')));

var cb0 = function (req, res, next) {
  console.log('CB0');
  next();
}

var cb1 = function (req, res, next) {
  console.log('CB1');
  next();
}

var cb2 = function (req, res) {
  console.log('CB2');
  res.send('Hello from C!');
}

let getUrlIP = function () {
    return new Promise(function (resolve, reject) {
        $.getJSON('http://ip-api.com/json', function (data, textStatus, jqXHR) {
            if (textStatus === "success") {
                var ipInfo = "Access from [" + data.query + "] " + data.city + ", " + data.regionName + " " + data.country + ". ISP is " + data.isp + ", Location is " + data.lat + ", " + data.lon;
                //console.log("Access from [%s] %s, %s %s. ISP is %s, location is %f, %f", data.query, data.city, data.regionName, data.country, data.isp, data.lat, data.lon);
                //console.log(JSON.stringify(data, null, 2));
                resolve(ipInfo);
            } else {
                reject("The errror status: " + textStatus);
            }
        });
    });
}

let myLogger = function (req, res, next) {
    getUrlIP().then((data, reject) => {
        //let _msg = "[" + req.requestTime + "] " + data;
        //successlog.info(_msg);
        logger.info(data);
        if (reject) logger.error(reject);

    });
    next();
}

let requestTime = function (req, res, next) {
    let tz_offset = (new Date()).getTimezoneOffset() * 60 * 1000; // get TZ offset in milliseconds
    let now = Date.now();
    req.requestTime = (new Date(now - tz_offset)).toISOString().
                      replace(/T/, ' ').      // replace T with a space
                      replace(/\..+/, '');    // delete the dot and everything after
    next();
}

app.use(requestTime);
app.use(myLogger);


app.get('/d', [cb0, cb1], function (req, res, next) {
  console.log('the response will be sent by the next function ...');
  next();
}, function (req, res) {
  res.send('Hello from D!');
})

app.get('/', (req, res) => {
    //let responseText = 'Welcome SFC Family<br>';
    //responseText += '<small>Visit at: ' + req.requestTime + '</small><br/>';
    //responseText += '<br/><br/><a href="/ec">SFC Admin Emergency Contact</a>';
    //responseText += '<br/><br/><a href="/2018fg">2018 Friday Group</a>';
    //responseText += '<br/><br/><a href="/2018sg">2018 Sunday Group</a>';
    //res.send(responseText);
    res.sendFile(path.join(__dirname + '/index.html'))
})
    .get('/cb', [cb0, cb1, cb2])
    .get('/ec', (req, res) => res.sendFile(path.join(__dirname + '/emergency-contact.html')))
    .get('/2018fg', (req, res, next) => {
        res.sendFile(path.join(__dirname + '/2018FridayGroup.html'));
    })
    .get('/2018sg', (req, res) => res.sendFile(path.join(__dirname + '/2018SundayGroup.html')))
    .get('/gssp', (req, res) => res.sendFile(path.join(__dirname + '/gssp.html')))
    .get('/assets', (req, res) => res.sendFile(path.join(__dirname + '/assets.html')))
    .get('/2018fr', (req, res) => res.sendFile(path.join(__dirname + '/2018FridayResult.html')))
    .get('/jersey', (req, res) => res.sendFile(path.join(__dirname + '/jersey-size.html')))
    .get('/2018wcpool', (req, res) => res.sendFile(path.join(__dirname + '/wcpool2018.html')))
    .get('/stat', (req, res) => res.sendFile(path.join(__dirname + '/resultStatistic.html')));
   //.get('*', (req, res) => res.sendFile(path.join(__dirname + '/404.html')));

app.use(function (req, res, next) {
    //res.status(404).send("Sorry can't find that!");
    res.status(404).sendFile(path.join(__dirname + '/404.html'));
})

app.listen(PORT, () => logger.error('App listening on port 5000!'))