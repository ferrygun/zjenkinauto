/*eslint no-console: 0, no-unused-vars: 0, no-undef:0, no-process-exit:0*/
/*eslint-env node, es6 */
"use strict";
const port = process.env.PORT || 3000;
const server = require("http").createServer();

const cds = require("@sap/cds");
//Initialize Express App for XSA UAA and HDBEXT Middleware
const xsenv = require("@sap/xsenv");
const passport = require("passport");
const xssec = require("@sap/xssec");
const xsHDBConn = require("@sap/hdbext");
const express = require("express");
global.__base = __dirname + "/";

//logging
var logging = require("@sap/logging");
var appContext = logging.createAppContext();

//Initialize Express App for XS UAA and HDBEXT Middleware
var app = express();

//Compression
app.use(require("compression")({
  threshold: "1b"
}));

//Helmet for Security Policy Headers
const helmet = require("helmet");
// ...
app.use(helmet());
app.use(helmet.contentSecurityPolicy({
  directives: {
    defaultSrc: ["'self'"],
    styleSrc: ["'self'", "sapui5.hana.ondemand.com"],
    scriptSrc: ["'self'", "sapui5.hana.ondemand.com"]
  }
}));
// Sets "Referrer-Policy: no-referrer".
app.use(helmet.referrerPolicy({ policy: "no-referrer" }));

passport.use("JWT", new xssec.JWTStrategy(xsenv.getServices({
	uaa: {
		tag: "xsuaa"
	}
}).uaa));
app.use(logging.middleware({
	appContext: appContext,
	logNetwork: true
}));
app.use(passport.initialize());
app.use(
	passport.authenticate("JWT", {
		session: false
	})
);

// Redirect any to service root
app.get("/", (req, res) => {
	res.send("Jenkins with UI5");
});

//Setup Additonal Node.js Routes
require("./router")(app, server);

//Start the Server 
server.on("request", app);
server.listen(port, function () {
	console.info(`HTTP Server: ${server.address().port}`);
});