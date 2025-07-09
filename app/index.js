/*
 *   Primary file for the API
 *
 */

// Dependencies

const http = require("http");
const https = require("https");
const url = require("url");
const StringDecoder = require("string_decoder").StringDecoder;
const config = require('./lib/config');
const fs = require('fs');
const handlers = require('./lib/handlers');
const helpers = require('./lib/helpers')
// const _data = require('./lib/data');

// TESTING
// @TODO delete this

// create
// _data.create('test', 'newFile', {'foo': 'bar'}, function(err) {
//   console.log('error creating:', err)
// })

// read
// _data.read('test', 'newFile1', function(err, data) {
//   console.log('error reading:', err, 'data:', data)
// })

// update
// _data.update('test', 'newFile1', {'fizz': 'buzz'}, function(err) {
//   console.log('error updating:', err)
// })

// delete
// _data.delete('test', 'newFile1', function(err) {
//   console.log('error deleting:', err)
// })

// Instantiate the HTTP server
const httpServer = http.createServer(function (req, res) {
  unifiedServer(req, res)
});

// Start the HTTP server
httpServer.listen(config.httpPort, function () {
  console.log(`The server is listening on port ${config.httpPort} in ${config.envName} mode`);
});

// Instantiate the HTTPS server
const httpsServerOptions = {
  'key': fs.readFileSync('./https/key.pem'),
  'cert': fs.readFileSync('./https/cert.pem'),
}

const httpsServer = https.createServer(httpsServerOptions, function (req, res) {
  unifiedServer(req, res)
});

// Start the HTTPS server
httpsServer.listen(config.httpsPort, function () {
  console.log(`The server is listening on port ${config.httpsPort} in ${config.envName} mode`);
});

// All the server logic for both the http and https server
const unifiedServer = function(req, res) {
  // Get the url and parse it
  const parsedUrl = url.parse(req.url, true);
  // Get the path
  const path = parsedUrl.pathname;
  const trimmedPath = path.replace(/^\/+|\/+$/g, "");

  // Get the query string as an object
  var queryStringObject = parsedUrl.query;

  // Get the HTTP Method
  const method = req.method.toLowerCase();

  // Get the headers as an object
  const headers = req.headers;

  // Get the payload, if any
  const decoder = new StringDecoder("utf-8");
  var buffer = "";
  req.on("data", function (data) {
    buffer += decoder.write(data);
  });

  req.on("end", function () {
    buffer += decoder.end();

    // Choose the handler this request should go to. If one is not found use the not found handler
    var chosenHandler =
      typeof router[trimmedPath] !== "undefined"
        ? router[trimmedPath]
        : handlers.notFound;

    // Construct the data object to send to the handler
    var data = {
      trimmedPath: trimmedPath,
      queryStringObject: queryStringObject,
      method: method,
      headers: headers,
      payload: helpers.parseJsonToObject(buffer),
    };

    //  Route the request to the handler specified in the router
    chosenHandler(data, function (statusCode, payload) {
      // Use the status code called back by the handler, or default to 200
      statusCode = typeof statusCode == "number" ? statusCode : 200;

      //  Use the payload called back by the handler or default to an empty object
      payload = typeof payload == "object" ? payload : {};

      //  Convert the payload to a string
      var payloadString = JSON.stringify(payload);

      // Return the response
      res.setHeader("Content-Type", "application/json");
      res.writeHead(statusCode);
      res.end(payloadString);

      //  Log the request path
      console.log("Returning this response:", statusCode, payloadString);
    });
  });
}

// Define a request router
var router = {
  ping: handlers.ping,
  sample: handlers.sample,
  'users': handlers.users,
  'tokens': handlers.tokens
};
