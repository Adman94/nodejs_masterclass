/*
 *   Primary file for the Hello World API
 *
 */

// Dependencies
const http = require("http");
const url = require("url");
const StringDecoder = require("string_decoder").StringDecoder;

// All the server logic for the http server
const httpServer = http.createServer(function (req, res) {

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
      payload: buffer,
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
});

httpServer.listen(9000, function() {
  console.log("The server is listening on port 9000.");
});

// Define the handlers
var handlers = {};

// Ping handler
handlers.ping = function(data, callback) {
  callback(200, {'ping': 'server is alive'});
}

handlers.hello = function(data, callback) {
  callback(200, {'hello': 'hello world!'});
}

// Not found handler
handlers.notFound = function (data, callback) {
  callback(404);
};

// Define a request router
var router = {
  ping: handlers.ping,
  hello: handlers.hello,
};