/*global QUnit*/

jQuery.sap.require("sap.ui.qunit.qunit-css");
jQuery.sap.require("sap.ui.thirdparty.qunit");
jQuery.sap.require("sap.ui.qunit.qunit-junit");
QUnit.config.autostart = false;

sap.ui.require([
	"sap/ui/test/Opa5",
	"zjblessons/ControlTaskErahovets/test/integration/pages/Common",
	"sap/ui/test/opaQunit",
	"zjblessons/ControlTaskErahovets/test/integration/pages/Worklist",
	"zjblessons/ControlTaskErahovets/test/integration/pages/Object",
	"zjblessons/ControlTaskErahovets/test/integration/pages/NotFound",
	"zjblessons/ControlTaskErahovets/test/integration/pages/Browser",
	"zjblessons/ControlTaskErahovets/test/integration/pages/App"
], function (Opa5, Common) {
	"use strict";
	Opa5.extendConfig({
		arrangements: new Common(),
		viewNamespace: "zjblessons.ControlTaskErahovets.view."
	});

	sap.ui.require([
		"zjblessons/ControlTaskErahovets/test/integration/WorklistJourney",
		"zjblessons/ControlTaskErahovets/test/integration/ObjectJourney",
		"zjblessons/ControlTaskErahovets/test/integration/NavigationJourney",
		"zjblessons/ControlTaskErahovets/test/integration/NotFoundJourney"
	], function () {
		QUnit.start();
	});
});