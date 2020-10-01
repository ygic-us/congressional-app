sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/core/ValueState",
	"sap/m/Dialog",
	"sap/m/DialogType",
	"sap/m/Button",
	"sap/m/ButtonType",
	"sap/m/Text",
	"sap/m/MessageBox",
	"sap/m/MessageToast",
	'sap/ui/model/json/JSONModel',	
], function (Controller, ValueState, Dialog, DialogType, Button, ButtonType, Text,MessageBox,MessageToast,JSONModel) {
	"use strict";

	return Controller.extend("ygic.timelogger.personal.YGIC-Personal-Timelogger.controller.MainPage", {
		
		onInit: function () {
			this.byId("idCategoryName").setSelectedIndex(null); 

			this.loadEntries();
		},
		loadEntries: function () {			
			var oView = this.getView();
			this.oProductsModel = this.initSampleProductsModel();
			oView.setModel(this.oProductsModel);
		},
		initSampleProductsModel: function () {
			var sPath = jQuery.sap.getModulePath("ygic.timelogger.personal.YGIC-Personal-Timelogger", "/model/entries.json");
			var oData = jQuery.sap.sjax({
				url: sPath,
				dataType: "json"
			}).data;
		

			var oModel = new JSONModel();
			oModel.setData(oData);
			return oModel;
		},
		loginPress: function(oEvent)
		{
			//authRedirect.signIn();
			signIn();
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
		saveTimeEntry : function(oEvent)
		{
			

			if(this.byId("calendar").getSelectedDates().length == 0)
			{
				MessageBox.information("Please choose a date in the calendar");
				return;
			}

			if(this.byId("idTimeIn").getValue() == "" || this.byId("idTimeIn").getValue() == "")
			{
				MessageBox.information("Please make sure you have entered both Start and End times ");
				return;
			}

			if(this.byId("idHoursLogged").getNumber().toString().includes("-"))
			{
				MessageBox.information("This is an invalid time entry. Please correct your time.");
				return;
			}

			if(this.byId("calendar").getSelectedDates()[0].getStartDate() > new Date())
			{
				MessageBox.information("You can't enter for future dates");
				return;
			}


		},
		categoryChanged: function (oEvent) {
			
			var idStopWatchVBox = this.byId("idStopWatchVBox");
			var categoryComboBox = this.byId("idCategoryName");
			if(idStopWatchVBox.getItems().length > 0)
			{
				MessageBox.information("You can have only one timer at a time.");
				return; 
			}
			//var idCategoryName = this.byId("idCategoryName").getSelectedItem().getText()
			var idCategoryName = categoryComboBox.getSelectedButton().getText()
			var model = new sap.ui.model.json.JSONModel({
				timer: 0,
				start: false,
				startedAt: new Date(),
				title: idCategoryName
			});
			var timer = null;			
			model.setProperty('/start', true);
			timer = setInterval(function () {										
				var startedAt = new Date(model.getProperty('/startedAt'));
				var diffInMilliSecs = new Date() - startedAt;
				var diffInSecs = Math.floor(diffInMilliSecs/1000);														
				model.setProperty('/timer', diffInSecs);
			 }, 1000);
			var vbox = new sap.m.VBox({
				alignItems: "Start",
				items: [									
					new sap.m.ObjectStatus({text: '{/title}', state:'Indication06',active:true,inverted:true }),
					new sap.m.Label({
						text: { path: '/startedAt', 
						formatter: function(t){ 
							return 'Started at ' + new Date(t).toTimeString().substring(0,5)
						}}, 
						design:"Bold"}).addStyleClass('greenColorFont'),
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
							}).addStyleClass('timerFace').addStyleClass('textFontSize'),
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
					})
				]
			}).addStyleClass("sapUiTinyMargin")
			//vbox.setModel(model);
			var hbox = new sap.m.HBox({
				alignItems: "Stretch",
				items: [vbox,
					new sap.m.Button({
						icon: 'sap-icon://stop',
						tooltip: 'Stop and save the timer',
						text:'Stop & Save',
						type:'Accept',						
						enabled: '{/start}',
						press: function (oEvent) {									
							clearInterval(timer);
							timer = null;
							var m = this.getModel();
							m.setProperty('/start', false);
							var startTime = m.getProperty('/startedAt');							
							var endTime = new Date();							
							var diff = endTime-startTime							
							var totalTimeWorked = Math.floor(diff/1000);
							alert(totalTimeWorked)													
							oEvent.getSource().getParent().getParent().removeItem(oEvent.getSource().getParent());
							categoryComboBox.setSelectedIndex(null); 
						}
					}).addStyleClass("sapUiTinyMargin").addStyleClass('timerButton')	,				
				new sap.m.Button({
					visible:false,
					iconFirst: true,
					type: "Reject",
					text:'Delete',
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
						oEvent.getSource().getParent().getParent().removeItem(oEvent.getSource().getParent());
						categoryComboBox.setSelectedIndex(null); 												
					}

				}).addStyleClass('timerButton')]}).addStyleClass("sapUiTinyMargin").addStyleClass('timerCase');;
			hbox.setModel(model);
			idStopWatchVBox.addItem(hbox);
		},
		droidPress: function(oEvt)
		{
			 Android.showToast("toast");
		}
	});
});