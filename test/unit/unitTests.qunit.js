/* global QUnit */
QUnit.config.autostart = false;

sap.ui.getCore().attachInit(function () {
	"use strict";

	sap.ui.require([
		"ygic/timelogger/personal/YGIC-Personal-Timelogger/test/unit/AllTests"
	], function () {
		QUnit.start();
	});
});