/*eslint no-console: 0, no-unused-vars: 0, no-shadow: 0, newcap:0*/
/*eslint-env node, es6 */
"use strict";
var express = require("express");
var async = require("async");
var jenkinsurl = "http://fd:papamama@10.31.1.67:8080";

module.exports = function () {
	var app = express.Router();

	app.get("/triggerJob", (req, res) => {
		var jenkins = require("jenkins")({
			baseUrl: jenkinsurl,
			crumbIssuer: true
		});

		jenkins.job.build("trigger", function (err, data) {
			if (err) {
				res.type("application/json").status(200).send("Error");
			} else {

				console.log("queue item number:" + data);
				res.type("application/json").status(200).send('{"queue":' + data + '}');
			}
		});
	});

	app.get("/statusJob", (req, res) => {
		var jenkins = require("jenkins")({
			baseUrl: jenkinsurl,
			crumbIssuer: true
		});

		jenkins.job.get("trigger", function (err, data) {
			if (err) {
				res.type("application/json").status(200).send("Error");
			} else {

				console.log("build:" + data);
				res.type("application/json").status(200).send(data);
			}
		});
	});
	
	app.get("/cancelJob", (req, res) => {
		var jobq = req.query.q;
		console.log(jobq);

		var jenkins = require("jenkins")({
			baseUrl: jenkinsurl,
			crumbIssuer: true
		});

		jenkins.build.stop('trigger', jobq, function(err) {
			if (err) {
				res.type("application/json").status(200).send('{"status":error}');
			} else {
				res.type("application/json").status(200).send('{"status":ok}');
			}
		});
	});

	return app;
};