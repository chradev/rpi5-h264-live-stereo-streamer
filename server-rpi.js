"use strict";

/**
* Run this on a raspberry pi 
* then browse (using google chrome/firefox) to http://[pi ip]:8080/
*/

const http    = require('http');
const express = require('express');

var ip = require('underscore')
    .chain(require('os').networkInterfaces())
    .values()
    .flatten()
    .find({family: 'IPv4', internal: false})
    .value()
    .address;

const camNr = process.argv[2] ? process.argv[2] : 0;
const portN = process.argv[3] ? process.argv[3] : 8080;
console.log("Watch camera " + camNr + " on http://" + ip + ":" + portN);

const WebStreamerServer = require('./lib/raspivid');

const app  = express();

  //public website
app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/vendor/dist'));

const server = http.createServer(app);
const wsssrv = new WebStreamerServer( server, 
    {cam: camNr, fps: 30, width: 960, height: 1080}
);

server.listen(portN);

