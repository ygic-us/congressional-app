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
	'sap/ui/core/util/Export',
	'sap/ui/core/util/ExportTypeCSV',
	'../util/Formatter'	
], function (Controller, ValueState, Dialog, DialogType, Button, ButtonType, Text,MessageBox,MessageToast,JSONModel, Export, ExportTypeCSV, Formatter) {
	"use strict";		
	var oStorage;
	var oEntriesModel;
	return Controller.extend("generic.timelogger.controller.MainPage", {		
		formatter: Formatter,

		onInit: function () {
			this.byId("idCategoryName").setSelectedIndex(null); 					
			jQuery.sap.require("jquery.sap.storage");
			oStorage = jQuery.sap.storage(jQuery.sap.storage.Type.local);
			//Check if there is data into the Storage
			if (oStorage.get("myLocalData")) {
				//MessageBox.information("Data from local ");	
			}
			else
			{				
				var emptyModel = { "Entries" : []};				
				oStorage.put("myLocalData",JSON.stringify(emptyModel));				
				var categoriesModel = {"Categories":[
					{"Name": "Sleep", "Key":"Sleep"},
					{"Name": "Study", "Key":"Study"},
					{"Name": "Internet", "Key":"Internet"},
					{"Name": "Entertainment", "Key":"Entertainment"},
					{"Name": "Sport", "Key":"Sport"},
					{"Name": "Transport", "Key":"Transport"},
					{"Name": "Eat", "Key":"Eat"},					
					{"Name": "Read", "Key":"Read"},
					{"Name": "Work", "Key":"Work"},
					{"Name": "Shop", "Key":"Shop"},					
					{"Name": "Housework", "Key":"Housework"},
					{"Name": "Cinema", "Key":"Cinema"},
					{"Name": "Walk", "Key":"Walk"},										
					{"Name": "Help", "Key":"Help"}					
				]}
				oStorage.put("myLocalData2",JSON.stringify(categoriesModel));
				var settingsModel = {"Settings":{"LastBackedUp": new Date().toISOString(), "DateInstalled": new Date().toISOString()}}
				oStorage.put("myLocalData3",JSON.stringify(settingsModel));
			}
			this.loadEntries();
			
		},
		handleDeleteCategory: function(oEvent)
		{
			var oitem = oEvent.getParameter("listItem").getBindingContext("Categories").getObject()
			var array = oEvent.getSource().getModel("Categories").getData().Categories;
			array.splice( array.indexOf( oitem), 1 );
			var categoryModel = this.getView().getModel("Categories");
			oStorage.put("myLocalData2",JSON.stringify(categoryModel.getData()))
			MessageBox.information("Saved your changes");
			this.getView().getModel("Categories").refresh()
			
		},
		addCategory : function(oEvent)
		{
			var dialog = new sap.m.Dialog({
				title: 'Create Category',
				type: 'Message',
				content: [
					new sap.m.Label({ text: 'Enter a category name', labelFor: 'submitDialogTextarea'}),
					new sap.m.Input('submitDialogTextarea', {
						liveChange: function(oEvent) {
							var sText = oEvent.getParameter('value');
							var parent = oEvent.getSource().getParent();

							parent.getBeginButton().setEnabled(sText.length > 0);
						},
						width: '100%'
						
					})
				],
				beginButton: new sap.m.Button({
					type: sap.m.ButtonType.Emphasized,
					text: 'Save',
					enabled: false,
					press: function () {
						var sText = sap.ui.getCore().byId('submitDialogTextarea').getValue();
						MessageToast.show('Note is: ' + sText);

						dialog.close();
					}
				}),
				endButton: new Button({
					text: 'Cancel',
					press: function () {
						dialog.close();
					}
				}),
				afterClose: function() {
					dialog.destroy();
				}
			});

			dialog.open();
		},
		// checkUpdatesPress : function(oEvent)
		// {
		// 	caches.keys().then(function(names) {
		// 		for (let name of names)
		// 			caches.delete(name);
		// 	});
		// 	navigator.serviceWorker.getRegistrations().then( function(registrations) { for(let registration of registrations) {registration.unregister(); } }); 
		// 	window.location.reload();
		// 	return false;
		// },

		iconTabBarChange : function(oEvent)
		{
			if(oEvent.getSource().getSelectedKey() == "stats")
			{
				// this.byId("hoursLastWeek")
				// this.byId("hoursLastMonth")
				// var model = this.getView().getModel()
				// var collection = model.getData().Entries
				// var totalweekly = 0;
				// var totalMonthly = 0;
				// var weekBefore = "";
				// var monthBeforeDate = "";
				// var firstDay = new Date();
 				// var previousweek= new Date(firstDay.getTime() - 7 * 24 * 60 * 60 * 1000);
				// for(var v = 0; v< collection.length; v++)
				// {
				// 	if(collection[v].TimeOfEntry < )
				// 	totalweekly = totalweekly + collection[v].TotalTimeWorkedInHours;
				// 	totalMonthly = totalMonthly + collection[v].TotalTimeWorkedInHours;
				// }
			
			}
			
		},
		deleteReportsPress : function(oEvent)
		{			
			oStorage.clear();			
			var emptyModel = { "Entries" : []};				
			oStorage.put("myLocalData",JSON.stringify(emptyModel));			
			MessageBox.success("Cleared all the report entries");
			this.loadEntries();
		},
		deleteCategoriesPress : function(oEvent)
		{
			var categoriesModel = {"Categories":[]}
			oStorage.put("myLocalData2",JSON.stringify(categoriesModel));
			MessageBox.success("All the categories");
			this.loadEntries();
		},
		downloadReportsPress : function(oEvt)
		{
			var oExport = new Export({

				// Type that will be used to generate the content. Own ExportType's can be created to support other formats
				exportType : new ExportTypeCSV({
					separatorChar : ","
				}),

				// Pass in the model created above
				models : this.getView().getModel(),

				// binding information for the rows aggregation
				rows : {
					path : "/Entries"
				},

				// column definitions with column name and binding info for the content																			
				columns : [{
					name : "Date",
					template : {
						content : "{Date}"
					}
				}, {
					name : "StartTime",
					template : {
						content : "{StartTime}"
					}
				}, {
					name : "EndTime",
					template : {
						content : "{EndTime}"
					}
				}, {
					name : "Category",
					template : {
						content : "{Category}"
						}					
					}
				, {
					name : "TotalTimeWorkedInSeconds",
					template : {
						content : "{TotalTimeWorkedInSeconds}"
					}
				}, {
					name : "TotalTimeWorkedInHours",
					template : {
						content : "{TotalTimeWorkedInHours}"
					}
				},
				{
					name : "TimeOfEntry",
					template : {
						content : "{TimeOfEntry}"
					}
				},
				{
					name : "IsManualEntry",
					template : {
						content : "{IsManualEntry}"
					}
				},
				{
					name : "Comments",
					template : {
						content : "{Comments}"
					}
				}
				
				]
			});

			// download exported file
			oExport.saveFile().catch(function(oError) {
				MessageBox.error("Error when downloading data. Device browser might not be supported!\n\n" + oError);
			}).then(function() {
				oExport.destroy();
				return;				
			});
			var settings =  JSON.parse(oStorage.get("myLocalData3"));
			settings.Settings.LastBackedUp = new Date().toISOString();
			oStorage.put("myLocalData3", JSON.stringify(settings));
		},
		loadEntries: function () {			
			var oView = this.getView();
			oEntriesModel = new JSONModel(); //this.initSampleProductsModel();
			oEntriesModel.setJSON(oStorage.get("myLocalData"))			
			oView.setModel(oEntriesModel);
			oEntriesModel.refresh(true)
			
			
			var categoriesModel = new JSONModel();
			categoriesModel.setJSON(oStorage.get("myLocalData2"))			
			oView.setModel(categoriesModel,"Categories");
			categoriesModel.refresh(true)	
			this.byId("idCategoryName").setSelectedIndex(null); 						
			
			if(oStorage.get("myLocalData3") != null)
			{
				var settings =  JSON.parse(oStorage.get("myLocalData3"));
				var lastBackedUp = new Date(settings.Settings.LastBackedUp);
				var dateToday = new Date();
				const diffTime = Math.abs(dateToday - lastBackedUp);
				const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
				this.byId("idlastBackedUpText").setText("Last backed up: " + settings.Settings.LastBackedUp.substring(0,19))
				if(diffDays > 1)
				{
					this.byId("idbackUpVBox").setVisible(true);					
				}
				else
				{
					this.byId("idbackUpVBox").setVisible(false);				
				}								
			}
			else{
				var settingsModel = {"Settings":{"LastBackedUp": new Date().toISOString(), "DateInstalled": new Date().toISOString()}}
				oStorage.put("myLocalData3",JSON.stringify(settingsModel));
				this.byId("idbackUpVBox").setVisible(false);
			}			
		},

		lineItemEndTimeChanged: function(oEvent)
		{
			console.log(oEvent);
			const convertTime12to24 = (time12h) => {
				const [time, modifier] = time12h.split(' ');
			  
				let [hours, minutes] = time.split(':');
			  
				if (hours === '12') {
				  hours = '00';
				}
			  
				if (modifier === 'PM') {
				  hours = parseInt(hours, 10) + 12;
				}
			  
				return `${hours}:${minutes}`;
			  }
			var startTime = convertTime12to24(oEvent.getSource().getBindingContext().getProperty("StartTime"));	
			var endTime = 	oEvent.getSource()._sOldInputValue;
			var timeTo = oEvent.getSource().getDateValue();
			var timeFrom = new Date(oEvent.getSource().getDateValue());
			timeFrom.setHours(startTime.split(':')[0])
			timeFrom.setMinutes(startTime.split(':')[1])

			var diffInMilliSecs = timeTo - timeFrom;
				var diffInMins = ((diffInMilliSecs / 1000) / 60);
				var diffInHours = ((diffInMins) / 60);
				var diff = Math.floor(diffInMins / 60) + "hrs " + (diffInMins % 60) + "mins";
				if(diff.toString().includes("-") || diff == "0hrs 0mins")
				{
					oEvent.getSource().setValue(endTime)
					MessageBox.information("Invalid End-Time selected, so this entry isn't updated.");
				}
				else
				{
					var oModel = oEvent.getSource().getBindingContext().getModel();
					var oContext = oModel.getContext(oEvent.getSource().getBindingContext().getPath());
					//oList.setBindingContext(oContext);
					var entry = oContext.getObject() 
					entry.TotalTimeWorkedInSeconds = diffInHours*60*60
					entry.TotalTimeWorkedInHours = diffInHours
					entry.EndTime = timeTo.toLocaleTimeString()
					oEvent.getSource().getModel().refresh(true)				
					
					oStorage.put("myLocalData",JSON.stringify(oEvent.getSource().getModel().getData()))
					MessageBox.information("Saved your changes");
				}


		},

		initSampleProductsModel: function () {
			var sPath = jQuery.sap.getModulePath("generic.timelogger", "/model/entries.json");
			var oData = jQuery.sap.sjax({
				url: sPath,
				dataType: "json"
			}).data;
		

			var oModel = new JSONModel();
			oModel.setData(oData);
			return oModel;
		},	
		
		pns: function()
		{
			Notification.requestPermission().then(function(result) {
				if(result === 'granted') {
					
    var notifTitle = "Notification Title";
    var notifBody = "Notification Body"
    var notifImg = '/images/icon.png';
    var options = {
        body: notifBody,
        icon: notifImg
    }
    var notif = new Notification(notifTitle, options);
    
				}
			});
		},
		
		handleTimeChange: function (oEvent) {
			this.CalcTimeDiff(this.byId("idTimeIn").getDateValue(),this.byId("idTimeOut").getDateValue());
		},
		CalcTimeDiff: function (timeFrom,timeTo) {			
			if (timeTo === null || timeFrom === null) {
				return;
			} else {
				var diffInMilliSecs = timeTo - timeFrom;
				var diffInMins = ((diffInMilliSecs / 1000) / 60);
				var diff = Math.floor(diffInMins / 60) + "hrs " + (diffInMins % 60) + "mins";
				if(diff.toString().includes("-") || diff == "0hrs 0mins")
				{
					this.byId("idHoursLogged").setNumber("Invalid time.");
					this.byId("saveTimeEntryButton").setEnabled(false);
				}
				else
				{
					this.byId("idHoursLogged").setNumber(diff);
					this.byId("saveTimeEntryButton").setEnabled(true);
				}
				
			}
		},
		saveTimeEntry : function(oEvent)
		{
			

			if(this.byId("calendar").getSelectedDates().length == 0)
			{
				MessageBox.information("Please choose a date in the calendar");
				return;
			}

			if(this.byId("idTimeIn").getValue() == "" || this.byId("idTimeOut").getValue() == "")
			{
				MessageBox.information("Please make sure you have entered both Start and End times ");
				return;
			}

			if(this.byId("idHoursLogged").getNumber().toString().includes("-"))
			{
				MessageBox.information("This is an invalid time entry. Please correct your time.");
				return;
			}
			this.byId("saveTimeEntryButton").setEnabled(true);
			// if(this.byId("calendar").getSelectedDates()[0].getStartDate() > new Date())
			// {
			// 	MessageBox.information("You can't enter for future dates");
			// 	return;
			// }
			var categoryComboBox = this.byId("categoryIdManualEntry");
			var timeFrom = this.byId("idTimeIn").getDateValue();
			var timeTo = this.byId("idTimeOut").getDateValue();
			var diffInMilliSecs = timeTo - timeFrom;
			var diffInMins = ((diffInMilliSecs / 1000) / 60);
			var diffInHours = ((diffInMins) / 60);
				
			
			var entry = { 	"Date": this.byId("calendar").getSelectedDates()[0].getStartDate().toLocaleDateString(), 
												"StartTime" : this.byId("idTimeIn").getValue(), 
												"EndTime": this.byId("idTimeOut").getValue() , 
												"Category": categoryComboBox.getSelectedButton().getText(),
												"TotalTimeWorkedInSeconds": diffInHours*60*60,
												"TotalTimeWorkedInHours": diffInHours,
												"TimeOfEntry" : new Date().toISOString(),
												"IsManualEntry": true,
												"Comments": this.byId("idCommentsInput").getValue()
											}
			oEntriesModel.getData().Entries.push(entry);
			oEntriesModel.refresh(true);
			oStorage.put("myLocalData",JSON.stringify(oEntriesModel.getData()))
			MessageBox.success("Entry saved successfully.");
			this.byId("calendar").destroySelectedDates()
			this.byId("idTimeIn").setValue(null)
			this.byId("idTimeOut").setValue(null)
			this.byId("idHoursLogged").setNumber("");
			this.byId("idCommentsInput").setValue("");
		},
		rbselectedTemp : function(oEvent)
		{
			
			switch(oEvent.getSource().getText())
			{
				case "Academic":
					this.byId("idCategoryName").setSelectedIndex(0)
					break;
					case "Maintenance":
						this.byId("idCategoryName").setSelectedIndex(1)
					break;
					case "Building Use":
						this.byId("idCategoryName").setSelectedIndex(2)
					break;
					case "Other":
						this.byId("idCategoryName").setSelectedIndex(3)
					break;
					default:
						break;
					
			}
			this.byId("idCategoryName").fireSelect();

		},
		categoryChanged: function (oEvent) {
			
			var idStopWatchVBox = this.byId("idStopWatchVBox");
			var categoryComboBox = this.byId("idCategoryName");
			if(idStopWatchVBox.getItems().length > 5)
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
					new sap.m.Switch({ type:'AcceptReject', state:true,
						change: function (oEvent) {									
							clearInterval(timer);
							timer = null;
							var m = this.getModel();
							m.setProperty('/start', false);
							var title = m.getProperty('/title');
							var startTime = m.getProperty('/startedAt');							
							var endTime = new Date();							
							var diff = endTime-startTime	
							var totalTimeWorked = Math.floor(diff/1000);
							if(totalTimeWorked < 60)						
							{
								MessageBox.information("Too little time to log.");
							}
							else
							{
								
								var entry = { 	"Date": new Date().toLocaleDateString(), 
												"StartTime" : new Date(startTime).toLocaleTimeString(),
												"StartTimeISOFormat" : new Date(startTime).toISOString(), 
												"EndTime":endTime.toLocaleTimeString(), 
												"EndTimeISOFormat":endTime.toISOString(), 
												"Category": title, 
												"TotalTimeWorkedInSeconds": totalTimeWorked,
												"TotalTimeWorkedInHours": (totalTimeWorked/3600).toFixed(2),
												"TimeOfEntry" : new Date().toISOString(),
												"IsManualEntry": false,
												"Comments": oEvent.getSource().getParent().getItems()[4].getContent()[0].getValue()
											}
								oEntriesModel.getData().Entries.push(entry);
								oEntriesModel.refresh(true);
								oStorage.put("myLocalData",JSON.stringify(oEntriesModel.getData()))
							}
							
							//var currentTimer = oEvent.getSource().getParent().getParent()
							oEvent.getSource().getParent().getParent().getParent().removeItem(oEvent.getSource().getParent().getParent())
							//oEvent.getSource().getParent().getParent().getParent().removeItem(currentTimer);
							//oEvent.getSource().getParent().getParent().getParent().removeAllItems()
							categoryComboBox.setSelectedIndex(null); 
						}
					}),
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
					}),					
					// new sap.m.Button({
					// 	icon: 'sap-icon://stop',
					// 	tooltip: 'Stop and save the timer',
					// 	text:'Stop and Save',
					// 	type:'Reject',						
					// 	enabled: '{/start}',
					// 	press: function (oEvent) {									
					// 		clearInterval(timer);
					// 		timer = null;
					// 		var m = this.getModel();
					// 		m.setProperty('/start', false);
					// 		var title = m.getProperty('/title');
					// 		var startTime = m.getProperty('/startedAt');							
					// 		var endTime = new Date();							
					// 		var diff = endTime-startTime	
					// 		var totalTimeWorked = Math.floor(diff/1000);
					// 		if(totalTimeWorked < 60)						
					// 		{
					// 			MessageBox.information("Too little time to log.");
					// 		}
					// 		else
					// 		{
								
					// 			var entry = { 	"Date": new Date().toLocaleDateString(), 
					// 							"StartTime" : new Date(startTime).toLocaleTimeString(), 
					// 							"EndTime":endTime.toLocaleTimeString(), 
					// 							"Category": title, 
					// 							"TotalTimeWorkedInSeconds": totalTimeWorked,
					// 							"TotalTimeWorkedInHours": (totalTimeWorked/3600).toFixed(2),
					// 							"TimeOfEntry" : new Date().toISOString(),
					// 							"IsManualEntry": false,
					// 							"Comments": oEvent.getSource().getParent().getItems()[4].getValue()
					// 						}
					// 			oEntriesModel.getData().Entries.push(entry);
					// 			oEntriesModel.refresh(true);
					// 			oStorage.put("myLocalData",JSON.stringify(oEntriesModel.getData()))
					// 		}
							
					// 		oEvent.getSource().getParent().getParent().getParent().removeItem(oEvent.getSource().getParent().getParent());
					// 		categoryComboBox.setSelectedIndex(null); 
					// 	}
					// }).addStyleClass("sapUiTinyMargin").addStyleClass('timerButton').addStyleClass('roundClass'),					
					new sap.m.Panel({ expanded: false, expandable: true,content: [new sap.m.Input({placeholder:'Comments if any',value:'', visible: true})]})					
					
					
				]
			}).addStyleClass("sapUiTinyMargin")
			//vbox.setModel(model);
			var hbox = new sap.m.HBox({
				alignItems: "Stretch",
				items: [vbox,
					// new sap.m.Button({
					// 	icon: 'sap-icon://stop',
					// 	tooltip: 'Stop and save the timer',
					// 	text:'Stop and Save',
					// 	type:'Reject',						
					// 	enabled: '{/start}',
					// 	press: function (oEvent) {									
					// 		clearInterval(timer);
					// 		timer = null;
					// 		var m = this.getModel();
					// 		m.setProperty('/start', false);
					// 		var title = m.getProperty('/title');
					// 		var startTime = m.getProperty('/startedAt');							
					// 		var endTime = new Date();							
					// 		var diff = endTime-startTime	
					// 		var totalTimeWorked = Math.floor(diff/1000);
					// 		if(totalTimeWorked < 60)						
					// 		{
					// 			MessageBox.information("Too little time to log.");
					// 		}
					// 		else
					// 		{
								
					// 			var entry = { 	"Date": new Date().toLocaleDateString(), 
					// 							"StartTime" : new Date(startTime).toLocaleTimeString(), 
					// 							"EndTime":endTime.toLocaleTimeString(), 
					// 							"Category": title, 
					// 							"TotalTimeWorkedInSeconds": totalTimeWorked,
					// 							"TotalTimeWorkedInHours": (totalTimeWorked/3600).toFixed(2),
					// 							"TimeOfEntry" : new Date().toISOString(),
					// 							"IsManualEntry": false
					// 						}
					// 			oEntriesModel.getData().Entries.push(entry);
					// 			oEntriesModel.refresh(true);
					// 			oStorage.put("myLocalData",JSON.stringify(oEntriesModel.getData()))
					// 		}
							
					// 		oEvent.getSource().getParent().getParent().removeItem(oEvent.getSource().getParent());
					// 		categoryComboBox.setSelectedIndex(null); 
					// 	}
					// }).addStyleClass("sapUiTinyMargin").addStyleClass('timerButton').addStyleClass('roundClass')	
					//,				
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
		}
	});
});