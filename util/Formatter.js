sap.ui.define(function () {
	"use strict";

	var Formatter = {

		
		calcHours: function(collection)
		{
            if(collection)
            {
                var total = 0;
			for(var v = 0; v< collection.length; v++)
			{
				total = total + collection[v].TotalTimeWorkedInHours;
			}
			return total.toFixed(2);
            }
            return 0;
			
		}
		
		
		
		
	};

	return Formatter;

}, /* bExport= */ true);