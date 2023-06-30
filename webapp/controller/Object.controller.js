/*global location*/
sap.ui.define([
		"zjblessons/ControlTaskErahovets/controller/BaseController",
		"sap/ui/model/json/JSONModel",
		"sap/ui/core/routing/History",
		"zjblessons/ControlTaskErahovets/model/formatter",
	"sap/m/MessageToast",
	"sap/ui/core/Fragment"
	], function (
		BaseController,
	JSONModel,
	History,
	formatter,
	MessageToast,
	Fragment
	) {
		"use strict";

		return BaseController.extend("zjblessons.ControlTaskErahovets.controller.Object", {

			formatter: formatter,

			/* =========================================================== */
			/* lifecycle methods                                           */
			/* =========================================================== */

			/**
			 * Called when the worklist controller is instantiated.
			 * @public
			 */
			onInit : function () {
				// Model used to manipulate control states. The chosen values make sure,
				// detail page is busy indication immediately so there is no break in
				// between the busy indication for loading the view's meta data
				var iOriginalBusyDelay,
					oViewModel = new JSONModel({
						busy : true,
						delay : 0,
						editMode: false,
						selectedKeyITB: 'form'
					});

				this.getRouter().getRoute("object").attachPatternMatched(this._onObjectMatched, this);

				// Store original busy indicator delay, so it can be restored later on
				iOriginalBusyDelay = this.getView().getBusyIndicatorDelay();
				this.setModel(oViewModel, "objectView");
				this.getOwnerComponent().getModel().metadataLoaded().then(function () {
						// Restore original busy indicator delay for the object view
						oViewModel.setProperty("/delay", iOriginalBusyDelay);
					}
				);
			},

			/* =========================================================== */
			/* event handlers                                              */
			/* =========================================================== */


			/**
			 * Event handler  for navigating back.
			 * It there is a history entry we go one step back in the browser history
			 * If not, it will replace the current entry of the browser history with the worklist route.
			 * @public
			 */
			onNavBack : function() {
				var sPreviousHash = History.getInstance().getPreviousHash();

				if (sPreviousHash !== undefined) {
					history.go(-1);
				} else {
					this.getRouter().navTo("worklist", {}, true);
				}
			},

			/* =========================================================== */
			/* internal methods                                            */
			/* =========================================================== */

			/**
			 * Binds the view to the object path.
			 * @function
			 * @param {sap.ui.base.Event} oEvent pattern match event in route 'object'
			 * @private
			 */
			_onObjectMatched : function (oEvent) {
				var sObjectId =  oEvent.getParameter("arguments").objectId;
				MessageToast.show(sObjectId);
				this.getModel().metadataLoaded().then( function() {
					var sObjectPath = this.getModel().createKey("zjblessons_base_Materials", {
						MaterialID :  sObjectId
					});
					this._bindView("/" + sObjectPath);
				}.bind(this));
			},

			/**
			 * Binds the view to the object path.
			 * @function
			 * @param {string} sObjectPath path to the object to be bound
			 * @private
			 */
			_bindView : function (sObjectPath) {
				var oViewModel = this.getModel("objectView"),
					oDataModel = this.getModel();

				this.getView().bindElement({
					path: sObjectPath,
					events: {
						change: this._onBindingChange.bind(this),
						dataRequested: function () {
							oDataModel.metadataLoaded().then(function () {
								// Busy indicator on view should only be set if metadata is loaded,
								// otherwise there may be two busy indications next to each other on the
								// screen. This happens because route matched handler already calls '_bindView'
								// while metadata is loaded.
								oViewModel.setProperty("/busy", true);
							});
						},
						dataReceived: function () {
							oViewModel.setProperty("/busy", false);
						}
					}
				});
			},

			_onBindingChange : function () {
				var oView = this.getView(),
					oViewModel = this.getModel("objectView"),
					oElementBinding = oView.getElementBinding();

				// No data for the binding
				if (!oElementBinding.getBoundContext()) {
					this.getRouter().getTargets().display("objectNotFound");
					return;
				}

				var oResourceBundle = this.getResourceBundle(),
					oObject = oView.getBindingContext().getObject(),
					sObjectId = oObject.MaterialID,
					sObjectName = oObject.MaterialText;

				oViewModel.setProperty("/busy", false);

				oViewModel.setProperty("/shareSendEmailSubject",
				oResourceBundle.getText("shareSendEmailObjectSubject", [sObjectId]));
				oViewModel.setProperty("/shareSendEmailMessage",
				oResourceBundle.getText("shareSendEmailObjectMessage", [sObjectName, sObjectId, location.href]));
			},

			_setEditMode(bMode){
				this.getModel('objectView').setProperty('/editMode', bMode)
			},

			onPressEditMaterial: function(){
				this._setEditMode(true)
			},

			onPressCancelEditMaterial: function(){
				this._setEditMode(false)
			},

			onPressSaveEditMaterial: function(){
				this._setEditMode(false)
			},

			onSelectITB: function(oEvent){
				const sSelectedKey = oEvent.getSource().getSelectedKey();
				this.getModel("objectView").setProperty("/selectedKeyITB", sSelectedKey);

				if(sSelectedKey === 'panels'){
					this._loadFragmentPanels()
				}
			},

			_loadFragmentPanels: function(){
				if(!this._pFragmentPanels){
					this._pFragmentPanels = Fragment.load({
						name:"zjblessons.ControlTaskErahovets.view.fragment.Panels",
						controller: this,
						id: this.getView().getId(),
					}).then(oPanels => {
						this._pFragmentPanels = oPanels;
						this.getView().addDependent(this._pFragmentPanels);
						return Promise.resolve(oPanels);
					});

					this._pFragmentPanels.then((oPanels) => {
						const IconTabBar = this.byId('idIconTabBarMulti');
						IconTabBar.removeAllContent();
						IconTabBar.insertContent(oPanels, 1);
					})
				}
			}

		});

	}
);