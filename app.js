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

let getUrlIP = function () {
    return new Promise(function (resolve, reject) {
        $.getJSON('http://ip-api.com/json', function (data, textStatus, jqXHR) {
            if (textStatus === "success") {
                var ipInfo = "Access from [" + data.query + "] " + data.city + ", " + data.regionName + " " + data.country + ". ISP is " + data.isp + ", Location is " + data.lat + ", " + data.lon;
                //console.log("Access from [%s] %s, %s %s. ISP is %s, location is %f, %f", data.query, data.city, data.regionName, data.country, data.isp, data.lat, data.lon);
                resolve(ipInfo);
            } else {
                reject("The errror status: " + textStatus);
            }
        });
    });
}

let myLogger = function (req, res, next) {
    getUrlIP().then((data, reject) => {
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

//app.use(requestTime);
//app.use(myLogger);


app.get('/', (req, res) => {
      res.sendFile(path.join(__dirname + '/index.html'))
   })
   .get('/ec', (req, res) => res.sendFile(path.join(__dirname + '/emergency-contact.html')))
   .get('/gssp', (req, res) => res.sendFile(path.join(__dirname + '/gssp.html')))
   .get('/2018fr', (req, res) => res.sendFile(path.join(__dirname + '/2018FridayResult.html')))
   .get('/2018wcpool', (req, res) => res.sendFile(path.join(__dirname + '/wcpool2018.html')));

app.use(function (req, res, next) {
    res.status(404).sendFile(path.join(__dirname + '/404.html'));
})

app.listen(PORT, () => logger.debug('App listening on port 5000!'))