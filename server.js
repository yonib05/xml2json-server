"use strict";
var http = require("http"),
    url = require("url"),
    ObjTree = require("xml-objtree"),
    objTree = new ObjTree();
var MODNAME = require("./package.json").name;
var VERSION = require("./package.json").version;
var noop = function(){};
var logger;
if(process.env.ENV !== 'production') {
    if (process.env.LOGGER === true) {
        logger = require('./logger');
    }
    else {
        logger = {log : console.log, warn: console.warn, error: console.error};
    }
}
else {
    logger = {log : noop, warn: noop, error: noop};
}



http.createServer(function (req, res) {
    logger.log('debug',  req.method + ' request received to ' + req.url);
    //dealing with favicons
    if (req.url === "/favicon.ico") {
        res.writeHead(200, {"Content-Type": "image/x-icon"} );
        res.end();
        return;
    }
    //is server functioning
    if (req.url === "/status") {
        res.writeHead(200, {"Content-Type": "application/json"});
        res.end(JSON.stringify({"status": 200}), "utf-8");
        return;
    }

    // test authenticate of request
    var header = req.headers.authorization || "",        // get the header
        token = header.split(/\s+/).pop() || "",            // and the encoded auth token
        auth = new Buffer(token, "base64").toString(),    // convert from base64
        parts = auth.split(/:/),                          // split on colon
        username = parts[0],
        password = parts[1];
    //check against process user and pass variables (pass in case sensitive)
    if (username.toLowerCase() !== process.env.HTTP_USERNAME.toLowerCase() || password !== process.env.HTTP_PASSWORD) {
        res.writeHead(401, {"Content-Type": "application/json"});
        res.end(JSON.stringify({"status": 401}), "utf-8");
        return;
    }
    //lets get cracking
    var url_parts = url.parse(req.url, true);
    var query = url_parts.query;
    var protocol = req.headers['req-protocol'] || query.protocol || 'http:',
        host = req.headers['req-host'] || query.host || '',
        path = req.headers['req-path'] || query.path || '',
        port = req.headers['req-port'] || query.port || 80,
        soap_action = req.headers['req-action'] || query.action || '' ,
        content_type = req.headers['req-type'] || query.type || "text/xml";
    logger.log(req.headers);
    logger.log(host);
    if(!host.length) {
        res.writeHead(400, {"Content-Type": "application/json"});
        res.end(JSON.stringify({"status": 400}), "utf-8");
        return;
    }

    var request_json = "",
        request_xml = "",
        response_xml = "",
        response_json = "";
    req.body = "";
    req.on("data", function (d) {
        req.body += d;
    });
    req.on("error", function (error) {
        if (error.code === "ENOENT") {
            res.writeHead(200, {"Content-Type": "application/json"});
            res.end(JSON.stringify(error), "utf-8");
        } else {
            res.writeHead(500);
            res.end("Sorry, check with the site admin for error: " + error.message + " ..\n");
        }
    });
    req.on("end", function () {
        if( req.body ) {
            //get json request
            request_json = JSON.parse(req.body);
            //convert json request to xml
            request_xml = objTree.writeXML(request_json);
            logger.log(request_json);
            logger.log(request_xml);

            logger.log(JSON.stringify({
                protocol: protocol,
                host: host,
                port: port,
                path: path,
                method: req.body.length ? "POST" : "GET",
                headers: {
                    "User-Agent": MODNAME + "/" + VERSION,
                    "Accept": "text/html,application/xhtml+xml,application/xml,text/xml;q=0.9,*/*;q=0.8",
                    "Accept-Encoding": "none",
                    "Accept-Charset": "utf-8",
                    "Connection": "close",
                    "Content-Type": content_type,
                    "SOAPAction": soap_action,
                    "Content-Length": Buffer.byteLength(request_xml)
                }
            }));

            //process request to remote server
            var request = http.request({
                protocol: protocol,
                host: host,
                port: port,
                path: path,
                method: req.body.length ? "POST" : "GET",
                headers: {
                    "User-Agent": MODNAME + "/" + VERSION,
                    "Accept": "text/html,application/xhtml+xml,application/xml,text/xml;q=0.9,*/*;q=0.8",
                    "Accept-Encoding": "none",
                    "Accept-Charset": "utf-8",
                    "Connection": "close",
                    "Content-Type": content_type,
                    "SOAPAction": soap_action,
                    "Content-Length": Buffer.byteLength(request_xml)
                }
            }, function (response) {
                var body = "";
                response.on("data", function (d) {
                    body += d;
                });
                response.on("end", function () {
                    if(response.statusCode === 200){
                        if (body.length) {
                            //get xml response from server
                            response_xml = body;
                            //convert to json
                            try {
                                response_json = objTree.parseXML(response_xml);
                            }
                            catch (e) {
                                response_json = body;
                            }
                        }

                        logger.log(response);
                        //send back to original requester
                        res.writeHead(response.statusCode, {"Content-Type": "application/json"});
                        logger.log(response_xml);
                        logger.log(response_json);
                        res.end(JSON.stringify(response_json), "utf-8");


                    }
                    else{
                        res.writeHead(response.statusCode, {"Content-Type": "application/json"});
                        res.end(JSON.stringify({error: response.statusCode, message: response.statusMessage, body: body}), "utf-8");
                    }

                });
            });
            // If Request to remote server failed return to sender why
            request.on("error", function (error) {
                if (error.code === "ENOENT") {
                    res.writeHead(200, {"Content-Type": "application/json"});
                    logger.error(error);
                    res.end(JSON.stringify(error), "utf-8");
                } else {
                    res.writeHead(500);
                    logger.error(error);
                    res.end("Sorry, check with the site admin for error: " + error.message + " ..\n");
                }
            });
            //Execute request
            request.write(request_xml);
            //close connection to remote server
            request.end();
        }
    });





}).listen(process.env.PORT || 8081);




