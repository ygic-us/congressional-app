sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/core/ValueState",
	"sap/m/Dialog",
	"sap/m/DialogType",
	"sap/m/Button",
	"sap/m/ButtonType",
	"sap/m/Text",
	"sap/m/MessageBox",
	"sap/m/MessageToast"
], function (Controller, ValueState, Dialog, DialogType, Button, ButtonType, Text,MessageBox,MessageToast) {
	"use strict";

	return Controller.extend("ygic.timelogger.personal.YGIC-Personal-Timelogger.controller.MainPage", {
		
		onInit: function () {
		},
		handleTimeChange: function (oEvent) {
			this.CalcTimeDiff();
		},
		CalcTimeDiff: function () {
			var timeFrom = this.byId("idTimeIn").getDateValue();
			var timeTo = this.byId("idTimeOut").getDateValue();
			if (timeTo === null || timeFrom === null) {
				return;
			} else {
				var diffInMilliSecs = timeTo - timeFrom;
				var diffInMins = ((diffInMilliSecs / 1000) / 60);
				var diff = Math.floor(diffInMins / 60) + "hrs " + (diffInMins % 60) + "mins";
				this.byId("idHoursLogged").setNumber(diff);
			}
		},
		categoryChanged: function (oEvent) {

			var idStopWatchVBox = this.byId("idStopWatchVBox");
			var categoryComboBox = this.byId("idCategoryName");
			var idCategoryName = this.byId("idCategoryName").getSelectedItem().getText()
			var model = new sap.ui.model.json.JSONModel({
				timer: 0,
				start: false,
				title: idCategoryName
			});
			var timer = null;

			var vbox = new sap.m.VBox({
				items: [
					new sap.m.Text({
						text: '{/title}'
					}).addStyleClass('timerFaceTitle'),
					new sap.m.HBox({
						items: [
							new sap.m.Text({
								text: {
									path: '/timer',
									formatter: function (t) {
										var v = Math.floor((t / 60) / 60);
										return (v < 10) ? '0' + v : v;
									}
								}
							}).addStyleClass('timerFace'),
							new sap.m.Text({
								text: ':'
							}).addStyleClass('timerFaceSep'),
							new sap.m.Text({
								text: {
									path: '/timer',
									formatter: function (t) {
										var v = Math.floor(t / 60) % 60;
										return (v < 10) ? '0' + v : v;
									}
								}
							}).addStyleClass('timerFace'),
							new sap.m.Text({
								text: {
									path: '/timer',
									formatter: function (t) {
										var v = t % 60;
										return (v < 10) ? '0' + v : v;
									}
								}
							}).addStyleClass('timerFace')
						]
					}),
					new sap.m.HBox({
						items: [
							new sap.m.Button({
								icon: 'sap-icon://media-play',
								width: '45px',
								tooltip: 'Start',
								enabled: {
									path: '/start',
									formatter: function (s) {
										return !s;
									}
								},
								press: function () {
									var m = this.getModel();
									m.setProperty('/start', true);
									timer = setInterval(function () {
										m.setProperty('/timer', m.getProperty('/timer') + 1);
									}, 1000);
								}
							}).addStyleClass('timerButton'),
							new sap.m.Button({
								icon: 'sap-icon://media-pause',
								tooltip: 'Pause/Stop',
								width: '45px',
								enabled: '{/start}',
								press: function () {
									clearInterval(timer);
									timer = null;
									var m = this.getModel();
									m.setProperty('/start', false);
								}
							}).addStyleClass('timerButton'),
							new sap.m.Button({
								icon: 'sap-icon://reset',
								tooltip: 'Reset',
								width: '45px',
								press: function () {
									if (timer) {
										clearInterval(timer);
										timer = null;
									}
									var m = this.getModel();
									m.setProperty('/start', false);
									m.setProperty('/timer', 0);
								}
							}).addStyleClass('timerButton')
						]
					})
				]
			}).addStyleClass('timerCase');
			//vbox.setModel(model);
			var hbox = new sap.m.HBox({
				alignItems: "Center",
				items: [vbox, 
				new sap.m.Button({
					text: "Save",
					type: "Accept",
					icon: "sap-icon://save",
					enabled: {
						path: '/start',
						formatter: function (s) {
							return !s;
						}
					},
					press: function () {
						var m = this.getModel();
						var timeInSecs = m.getProperty('/timer');
						if (timeInSecs == 0) {
							if (!this.oErrorMessageDialog) {
								this.oErrorMessageDialog = new Dialog({
									type: DialogType.Message,
									title: "Error",
									state: ValueState.Error,
									content: new Text({
										text: "You can't log this time as you haven't started it."
									}),
									beginButton: new Button({
										type: ButtonType.Emphasized,
										text: "OK",
										press: function () {
											this.oErrorMessageDialog.close();
										}.bind(this)
									})
								});
							}

							this.oErrorMessageDialog.open();
						} else {
							alert(timeInSecs);
							//do stuff to save to the cloud
							//once done reset the timer and destroy the container
							//{ category : "",}
						}

					}

				}).addStyleClass("sapUiTinyMargin"),
				new sap.m.Button({
					iconFirst: true,
					type: "Reject",
					icon: "sap-icon://delete",
					enabled: {
						path: '/start',
						formatter: function (s) {
							return !s;
						}
					},
					press: function (oEvent) {
						var m = this.getModel();
						var timeInSecs = m.getProperty('/timer');
						if (timeInSecs == 0) {
							if (!this.oErrorMessageDialog) {
								oEvent.getSource().getParent().getParent().removeItem(oEvent.getSource().getParent());
								categoryComboBox.setSelectedItem(null);
							}
						}
						else
						{
							
							MessageBox.information("You should reset the timer to delete the timer.", {
				styleClass: "sapUiResponsivePadding--header sapUiResponsivePadding--content sapUiResponsivePadding--footer",
				actions: [MessageBox.Action.OK],
				emphasizedAction: MessageBox.Action.OK,
				onClose: function (sAction) {
					MessageToast.show("Action selected: " + sAction);
					if(sAction === "OK")
					{
							//
					}
				}
			});
						}

					}

				})]}).addStyleClass("sapUiTinyMargin");
			hbox.setModel(model);
			idStopWatchVBox.addItem(hbox);
		},
		droidPress: function(oEvt)
		{
			 Android.showToast("toast");
		}
	});
});