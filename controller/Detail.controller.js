/*global location */
sap.ui.define([
		"myapp/controller/BaseController",
		"sap/ui/model/json/JSONModel",
		"myapp/model/formatter"
	], function (BaseController, JSONModel, formatter) {
		"use strict";

		return BaseController.extend("myapp.controller.Detail", {

			formatter: formatter,

			/* =========================================================== */
			/* lifecycle methods                                           */
			/* =========================================================== */

			onInit : function () {

				// Model used to manipulate control states. The chosen values make sure,
				// detail page is busy indication immediately so there is no break in
				// between the busy indication for loading the view's meta data
				var oViewModel = new JSONModel({
					busy : false,
					delay : 0,
					 myDate : new Date(),
					lineItemListTitle : this.getResourceBundle().getText("detailLineItemTableHeading")
				});
				//	this.byId("EditDetails--complDateDP").setDateValue(new Date());
 				this.getRouter().getRoute("object").attachPatternMatched(this._onObjectMatched, this);
				this.setModel(oViewModel, "detailView");
				this.getOwnerComponent().getModel().metadataLoaded().then(this._onMetadataLoaded.bind(this));
			},

			/* =========================================================== */
			/* event handlers                                              */
			/* =========================================================== */

			/**
			 * Event handler when the share by E-Mail button has been clicked
			 * @public
			 */
			onShareEmailPress : function () {
				var oViewModel = this.getModel("detailView");

				sap.m.URLHelper.triggerEmail(
					null,
					oViewModel.getProperty("/shareSendEmailSubject"),
					oViewModel.getProperty("/shareSendEmailMessage")
				);
			},

			/**
			 * Event handler when the share in JAM button has been clicked
			 * @public
			 */
			onShareInJamPress : function () {
				var oViewModel = this.getModel("detailView"),
					oShareDialog = sap.ui.getCore().createComponent({
						name : "sap.collaboration.components.fiori.sharing.dialog",
						settings : {
							object :{
								id : location.href,
								share : oViewModel.getProperty("/shareOnJamTitle")
							}
						}
					});

				oShareDialog.open();
			},

			/**
			 * Updates the item count within the line item table's header
			 * @param {object} oEvent an event containing the total number of items in the list
			 * @private
			 */
			onListUpdateFinished : function (oEvent) {
				var sTitle,
					iTotalItems = oEvent.getParameter("total"),
					oViewModel = this.getModel("detailView");

				// only update the counter if the length is final
				if (this.byId("lineItemsList").getBinding("items").isLengthFinal()) {
					if (iTotalItems) {
						sTitle = this.getResourceBundle().getText("detailLineItemTableHeadingCount", [iTotalItems]);
					} else {
						//Display 'Line Items' instead of 'Line items (0)'
						sTitle = this.getResourceBundle().getText("detailLineItemTableHeading");
					}
					oViewModel.setProperty("/lineItemListTitle", sTitle);
				}
			},

			/**
			 * Updates the item count within the line item table's header
			 * @param {object} oEvent an event containing the total number of items in the list
			 * @private
			 */
			onListUpdateFinished2 : function (oEvent) {
				var sTitle,
					iTotalItems = oEvent.getParameter("total"),
					oViewModel = this.getModel("detailView");

				// only update the counter if the length is final
				if (this.byId("lineItemsList1").getBinding("items").isLengthFinal()) {
					if (iTotalItems) {
						sTitle = this.getResourceBundle().getText("detailLineItemTableMetricsCount", [iTotalItems]);
					} else {
						//Display 'Line Items' instead of 'Line items (0)'
						sTitle = this.getResourceBundle().getText("detailLineItemTableHeading1");
					}
					oViewModel.setProperty("/lineItemListTitle1", sTitle);
				}
			},
			onListUpdateFinished3 : function (oEvent) {
				var sTitle,
					iTotalItems = oEvent.getParameter("total"),
					oViewModel = this.getModel("detailView");

				// only update the counter if the length is final
				if (this.byId("lineItemsTraining").getBinding("items").isLengthFinal()) {
					if (iTotalItems) {
						sTitle = this.getResourceBundle().getText("detailLineItemTableTrainingCount", [iTotalItems]);
					} else {
						//Display 'Line Items' instead of 'Line items (0)'
						sTitle = this.getResourceBundle().getText("detailLineItemTableHeading2");
					}
					oViewModel.setProperty("/lineItemListTitle2", sTitle);
				}
			},
			closeDialog: function (oEvent) {
				
					sap.ui.getCore().byId("EditDetails--testme").close();
					//sap.ui.getCore().byId("EditDetails--testme").destroy();
				
 			},
 			onSave: function (oEvent) {
 			debugger;
 			var myModeltmp = this.getView().getModel();
 				//Var oLineItemTable = this.byId("lineItemsList");
				var oEntry = {};
				oEntry.GoalId = sap.ui.getCore().byId("EditDetails--ID_4").getValue();
				oEntry.CourseTitle = sap.ui.getCore().byId("EditDetails--ID_1").getValue();
				oEntry.ComplDate = sap.ui.getCore().byId("EditDetails--complDateDP").getDateValue(); 
				/* getValue();
				*/
			//	debugger;
				
			   myModeltmp.update("/EmployeeGoalSet('"+oEntry.GoalId+"')", oEntry, { method: 'PUT'});	 		
 			},
			onEditPress: function (oEvent) {
				  // get the fragment
				   var oMyModel = this.getModel("detailView");
                this._getDialog(oEvent).open();
				 //sap.m.MessageToast.show("TT");
				 
 			},
 			formatMyDate: function (value) {
 				 var oDateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern : "MM-dd-yyyy"});
				return oDateFormat.format(new Date(value)); 
 			},
             _getDialog : function(oEvent) {
                // create a fragment with dialog, and pass the selected data
                debugger;
                var oMyModel = this.getModel("detailView");
                var oSelectedItem = oEvent.getSource();
                var oContext = oSelectedItem.getBindingContext();
                var goalid = oContext.getProperty("GoalId");
                var ctitle = oContext.getProperty("CourseTitle");
                var stDate = oContext.getProperty("StartDate");
                var enDate = oContext.getProperty("EndDate");
        	    var oDateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern : "MM-dd-yyyy"});
                var newStDate = oDateFormat.format(new Date(stDate));  
                
			    var newEnDate = oDateFormat.format(new Date(enDate)); 
			    
                if (!this.dialog) {
                    // This fragment can be instantiated from a controller as follows:
                     this.dialog = sap.ui.xmlfragment("EditDetails","myapp.view.FrgEditDetails", this);
                 }
				
               
                //sap.m.MessageToast.show(newStDate);
                sap.ui.getCore().byId("EditDetails--ID_1").setValue(ctitle); 
                sap.ui.getCore().byId("EditDetails--ID_2").setValue(newStDate);
                sap.ui.getCore().byId("EditDetails--ID_3").setValue(newEnDate);  
                sap.ui.getCore().byId("EditDetails--ID_4").setValue(goalid);
                //sap.ui.getCore().byId("EditDetails--complDateDP").setValue(curDate);
                //curDate = sap.ui.getCore().byId("EditDetails--complDateDP").getValue();
                var curDate = oDateFormat.format(new Date());
                sap.ui.getCore().byId("EditDetails--complDateDP").setValue(curDate); 
                sap.ui.getCore().byId("EditDetails--complDateDP").focus();
                curDate = oDateFormat.format(new Date(newStDate));
                return this.dialog;
            },			
 			
 			
			onListUpdateFinished4 : function (oEvent) {
				var sTitle,
					iTotalItems = oEvent.getParameter("total"),
					oViewModel = this.getModel("detailView");

				// only update the counter if the length is final
				if (this.byId("lineItemsFeedBack").getBinding("items").isLengthFinal()) {
					if (iTotalItems) {
						sTitle = this.getResourceBundle().getText("detailLineItemTableFeedBackCount", [iTotalItems]);
					} else {
						//Display 'Line Items' instead of 'Line items (0)'
						sTitle = this.getResourceBundle().getText("detailLineItemTableHeading3");
					}
					oViewModel.setProperty("/lineItemListTitle3", sTitle);
				}
			},
			/* =========================================================== */
			/* begin: internal methods                                     */
			/* =========================================================== */

			/**
			 * Binds the view to the object path and expands the aggregated line items.
			 * @function
			 * @param {sap.ui.base.Event} oEvent pattern match event in route 'object'
			 * @private
			 */
			_onObjectMatched : function (oEvent) {
				var sObjectId =  oEvent.getParameter("arguments").objectId;
				this.getModel().metadataLoaded().then( function() {
					var sObjectPath = this.getModel().createKey("EmployeeSet", {
						EmpId :  sObjectId
					});
					this._bindView("/" + sObjectPath);
				}.bind(this));
			},

			/**
			 * Binds the view to the object path. Makes sure that detail view displays
			 * a busy indicator while data for the corresponding element binding is loaded.
			 * @function
			 * @param {string} sObjectPath path to the object to be bound to the view.
			 * @private
			 */
			_bindView : function (sObjectPath) {
				// Set busy indicator during view binding
				var oViewModel = this.getModel("detailView");

				// If the view was not bound yet its not busy, only if the binding requests data it is set to busy again
				oViewModel.setProperty("/busy", false);

				this.getView().bindElement({
					path : sObjectPath,
					events: {
						change : this._onBindingChange.bind(this),
						dataRequested : function () {
							oViewModel.setProperty("/busy", true);
						},
						dataReceived: function () {
							oViewModel.setProperty("/busy", false);
						}
					}
				});
			},

			_onBindingChange : function () {
				var oView = this.getView(),
					oElementBinding = oView.getElementBinding();

				// No data for the binding
				if (!oElementBinding.getBoundContext()) {
					this.getRouter().getTargets().display("detailObjectNotFound");
					// if object could not be found, the selection in the master list
					// does not make sense anymore.
					this.getOwnerComponent().oListSelector.clearMasterListSelection();
					return;
				}

				var sPath = oElementBinding.getPath(),
					oResourceBundle = this.getResourceBundle(),
					oObject = oView.getModel().getObject(sPath),
					sObjectId = oObject.EmpId,
					sObjectName = oObject.FirstName,
					oViewModel = this.getModel("detailView");

				this.getOwnerComponent().oListSelector.selectAListItem(sPath);

				oViewModel.setProperty("/saveAsTileTitle",oResourceBundle.getText("shareSaveTileAppTitle", [sObjectName]));
				oViewModel.setProperty("/shareOnJamTitle", sObjectName);
				oViewModel.setProperty("/shareSendEmailSubject",
					oResourceBundle.getText("shareSendEmailObjectSubject", [sObjectId]));
				oViewModel.setProperty("/shareSendEmailMessage",
					oResourceBundle.getText("shareSendEmailObjectMessage", [sObjectName, sObjectId, location.href]));
			},

			_onMetadataLoaded : function () {
				// Store original busy indicator delay for the detail view
				var iOriginalViewBusyDelay = this.getView().getBusyIndicatorDelay(),
					oViewModel = this.getModel("detailView"),
					oLineItemTable = this.byId("lineItemsList"),
					iOriginalLineItemTableBusyDelay = oLineItemTable.getBusyIndicatorDelay();

				// Make sure busy indicator is displayed immediately when
				// detail view is displayed for the first time
				oViewModel.setProperty("/delay", 0);
				oViewModel.setProperty("/lineItemTableDelay", 0);

				oLineItemTable.attachEventOnce("updateFinished", function() {
					// Restore original busy indicator delay for line item table
					oViewModel.setProperty("/lineItemTableDelay", iOriginalLineItemTableBusyDelay);
				});

				// Binding the view will set it to not busy - so the view is always busy if it is not bound
				oViewModel.setProperty("/busy", true);
				// Restore original busy indicator delay for the detail view
				oViewModel.setProperty("/delay", iOriginalViewBusyDelay);
			}

		});

	}
);