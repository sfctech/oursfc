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

const axios = require('axios');

const express = require('express');
const app = express();
const path = require("path");
const PORT = process.env.PORT || 5000;

// https://github.com/ericf/express-handlebars
const exphbs = require('express-handlebars');
app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

// using Twilio SendGrid's v3 Node.js Library
// https://github.com/sendgrid/sendgrid-nodejs
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey('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');

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

var cb2 = function (req, res, next) {
  console.log('CB2');
    //res.send('Hello from C!');
    res.send(JSON.stringify({
        message: "Hello from C!"
    }));
    next();
}

const sendMail = function (req, res) {
    const msg = {
        to: ['buccaneermontreal@gmail.com', 'sleunghome@gmail.com', 'luoxiaobin@gmail.com', 'kitchang1016@gmail.com', 'henrykwok212@gmail.com', 'ekwlau8@gmail.com', 'fktong2@gmail.com', 'dereksing16@outlook.com', 'lialbert298@gmail.com'],
        from: 'sfctech2015@gmail.com',
        subject: 'Noise from ' + req.query.name,
        text: deHtmlEscape(decodeURIComponent(req.query.op)),
        html: '<strong>' + deHtmlEscape(decodeURIComponent(req.query.op)) + '</strong>'
    };
    sgMail.send(msg);

    //console.log('Send Mail via SendGrid');
    //console.log('ACTUAL RESPONSE');
    // ***this is a trip to prevent response twice via send json format***
    //res.send(JSON.stringify({
    //    message: "Your opinion is sent to SFC Admins successfully! Now you can close current Tab in your browser. (你可以关闭当前页面)"
    //    //message: "Your opinion is sent to SFC Admins successfully! Now you can close current Tab in your browser."
    //}));
    //res.send('Sent an Email!');

    res.render('message', {
        message1: "Your opinion is sent to SFC Admins successfully!",
        message2: "Now you can close current Tab in your browser. (" + deHtmlEscape(decodeURIComponent(req.query.hint)) + ")"
    });
}


let myLogger = function (req, res, next) {
    axios.get('http://ip-api.com/json')
        .then(function (response) {
            let data = response.data;
            // handle success
            let _msg = "Access from [" + data.query + "] " + data.city + ", " + data.regionName + " " + data.country + ". ISP is " + data.isp + ", Location is " + data.lat + ", " + data.lon;
            //logger.info(_msg);
        })
        .catch(function (error) {
            // handle error
            logger.error(error);
        })
        .finally(function () {
            // always executed
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
const deHtmlEscape = (str) => {
    return String(str)
        .replace(/&amp;/g, '&')
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'")
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>');
}

// function to prevent response twice
app.use(function (req, res, next) {
    //console.log("INTERCEPT-REQUEST");
    const orig_send = res.send;
    res.send = function (arg) {
        //console.log("INTERCEPT-RESPONSE", JSON.stringify(arguments));
        orig_send.call(res, arg);
    };
    next();
});

app.use(requestTime);
app.use(myLogger);

// to enable cross-origin resource sharing (CORS) in the express.js framework on node.js
app.all('*', function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

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
    .get('/sendmail', [sendMail])
    .get('/ec', (req, res) => res.sendFile(path.join(__dirname + '/emergency-contact.html')))
    .get('/2018fg', (req, res, next) => {
        res.sendFile(path.join(__dirname + '/2018FridayGroup.html'));
    })
    .get('/2018sg', (req, res) => res.sendFile(path.join(__dirname + '/2018SundayGroup.html')))
    .get('/gssp', (req, res) => res.sendFile(path.join(__dirname + '/gssp.html')))
    .get('/assets', (req, res) => res.sendFile(path.join(__dirname + '/assets.html')))
    .get('/2018fr', (req, res) => res.sendFile(path.join(__dirname + '/2018FridayResult.html')))
    .get('/2018dome', (req, res) => res.sendFile(path.join(__dirname + '/2018DomeResult.html')))
    .get('/2019Outdoor', (req, res) => res.sendFile(path.join(__dirname + '/2019OutdoorResult.html')))
    .get('/2019dome', (req, res) => res.sendFile(path.join(__dirname + '/2019DomeResult.html')))
    .get('/jersey', (req, res) => res.sendFile(path.join(__dirname + '/jersey-size.html')))
    .get('/2018wcpool', (req, res) => res.sendFile(path.join(__dirname + '/wcpool2018.html')))
    .get('/2019clpool', (req, res) => res.sendFile(path.join(__dirname + '/uefacl2019.html')))
    .get('/2020clpool', (req, res) => res.sendFile(path.join(__dirname + '/uefacl2020.html')))
    .get('/stat2018fr', (req, res) => res.sendFile(path.join(__dirname + '/resultStatistic.html')))
    .get('/stat2018dome', (req, res) => res.sendFile(path.join(__dirname + '/2018DomeStatistic.html')))
    .get('/stat2019Outdoor', (req, res) => res.sendFile(path.join(__dirname + '/2019OutdoorStatistic.html')))
    .get('/stat2019dome', (req, res) => res.sendFile(path.join(__dirname + '/2019DomeStatistic.html')))
    .get('/face', (req, res) => res.sendFile(path.join(__dirname + '/facePlusPlus.html')))
    .get('/avatar', (req, res) => res.sendFile(path.join(__dirname + '/avatar.html')))
    .get('/opinion', (req, res) => res.sendFile(path.join(__dirname + '/opinion.html')))
    ;
   //.get('*', (req, res) => res.sendFile(path.join(__dirname + '/404.html')));

app.use(function (req, res, next) {
    //res.status(404).send("Sorry can't find that!");
    res.status(404).sendFile(path.join(__dirname + '/404.html'));
})

app.listen(PORT, () => logger.error('App listening on port 5000!'))