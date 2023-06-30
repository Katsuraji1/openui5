sap.ui.define([
		"zjblessons/ControlTaskErahovets/controller/BaseController"
	], function (BaseController) {
		"use strict";

		return BaseController.extend("zjblessons.ControlTaskErahovets.controller.NotFound", {

			/**
			 * Navigates to the worklist when the link is pressed
			 * @public
			 */
			onLinkPressed : function () {
				this.getRouter().navTo("worklist");
			}

		});

	}
);