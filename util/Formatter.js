sap.ui.define(function () {
	"use strict";

	var Formatter = {

		
		calcHours: function(collection)
		{
            
            var total = 0;
			for(var v = 0; v< collection.length; v++)
			{
				total = total + parseFloat(collection[v].TotalTimeWorkedInHours);
			}
			return parseFloat(total).toFixed(2);
            
			
		},
		roundHours: function(value)
		{
			return parseFloat(value).toFixed(2);
		}
		
		
		
		
	};

	return Formatter;

}, /* bExport= */ true);