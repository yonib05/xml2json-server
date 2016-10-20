"use strict";
var http = require("http"),
    url = require("url"),
    ObjTree = require("xml-objtree"),
    objTree = new ObjTree();
var MODNAME = require("./package.json").name;
var VERSION = require("./package.json").version;

http.createServer(function (req, res) {
    //dealing with favicons
    if (req.url === "/favicon.ico") {
        res.writeHead(200, {"Content-Type": "image/x-icon"} );
        res.end();
        return;
    }
    //is server functioning
    if (req.url === "/status" || req.method === "GET") {
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
        //get json request
        req.body = JSON.parse(req.body);
        request_json = req.body.request;
        //convert json request to xml
        request_xml = objTree.writeXML(request_json);
        //process request to remote server
        var request = http.request({
            protocol: req.body.protocol || "http:",
            host: req.body.host || query.host,
            port: req.body.port || query.port || 80,
            path: req.body.path || query.path,
            method: req.body.request ? "POST" : "GET",
            headers: {
                "User-Agent": MODNAME + "/" + VERSION,
                "Accept": "text/html,application/xhtml+xml,application/xml,text/xml;q=0.9,*/*;q=0.8",
                "Accept-Encoding": "none",
                "Accept-Charset": "utf-8",
                "Connection": "close",
                "Content-Type": req.body["content-type"] || "text/xml",
                "SOAPAction": req.body.SOAPAction || "",
                "Content-Length": Buffer.byteLength(request_xml)
            }
        }, function (response) {
            var body = "";
            response.on("data", function (d) {
                body += d;
            });
            response.on("end", function () {
                //get xml response from server
                response_xml = body;
                //convert to json
                response_json = objTree.parseXML(response_xml);
                //send back to original requester
                res.writeHead(200, {"Content-Type": "application/json"});
                res.end(JSON.stringify(response_json), "utf-8");
            });
        });
        // If Request to remote server failed return to sender why
        request.on("error", function (error) {
            if (error.code === "ENOENT") {
                res.writeHead(200, {"Content-Type": "application/json"});
                res.end(JSON.stringify(error), "utf-8");
            } else {
                res.writeHead(500);
                res.end("Sorry, check with the site admin for error: " + error.message + " ..\n");
            }
        });
        //Execute request
        request.write(request_xml);
        //close connection to remote server
        request.end();
    });
}).listen(process.env.PORT || 8081);
