/*!
 * OpenUI5
 * (c) Copyright 2009-2020 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

// sap.ui.mdc.AggregationBaseDelegate
sap.ui.define(['sap/ui/mdc/BaseDelegate'], function (BaseDelegate) {
	"use strict";

	/**
	 * ListBase Delegate for {@link sap.ui.mdc.Control MDC Control}. Extend this object in your project to use all functionalites for the following MDC Controls:
	 *
	 * <ul>
	 * <li><code>sap.ui.mdc.Chart</code></li>
	 * <li><code>sap.ui.mdc.Table</code></li>
	 * <li><code>sap.ui.mdc.FilterBar</code></li>
	 * </ul>
	 *
	 * In advance to the <code>BaseDelegate</code> the <code>AggregationBaseDelegate</code> provides capabilities to provide an property info array, and implement
	 * hooks to customize the control creation and cleanup for the implementing MDC Control default aggregation.
	 *
	 * <b>Note:</b>
	 * The class is experimental and the API/behavior is not finalized and hence this should not be used for productive usage.
	 * @author SAP SE
	 * @private
	 * @experimental
	 * @since 1.82.0
	 * @alias sap.ui.mdc.AggregationBaseDelegate
	 */
	var AggregationBaseDelegate = Object.assign(BaseDelegate, {

		/**
	 	 * Retrieves the relevant metadata for a given payload and returns the property info array.
		 *
		 * @param {Object} oControl MDC Control instance
		 * @returns {Promise} Once resolved, an array of property info objects is returned
		 */
		fetchProperties: function(oControl) {
			return Promise.resolve([]);
		},

		/**
		 * Creates an instance of the implementing MDC Control's default aggregation.
		 *
		 * @param {String} sPropertyName The name of the property info object/JSON
		 * @param {Object<sap.ui.mdc.Control>} oControl Instance of a MDC Control
		 * @param {Object} [mPropertyBag] Instance of property bag from SAPUI5 flexibility change API
		 * <b>Note:</b>
		 * The <code>addItem</code> Hook may be used during SAPUI5 flexibility change appliance and during runtime.
		 * Consequently the parameter <code>mPropertyBag</code> is only being passed once a change is being applied
		 * during flexibility processing. In runtime scenarios (such as opening a personalization dialog), this
		 * method might be called without the parameter <code>mPropertyBag</code>.
		 *
		 * @returns {Promise} Promise that resolves with an instance of the implementing {@link sap.ui.mdc.Control Control} default aggregation.
		 * <b>Note:</b>
		 * This method always expects a return value once it has been called. In case an item for a given property <code>sPropertyName</code>
		 * has already been created it is epected to either create a new instance or return the existing instance.
		 *
		 * @public
		 */
		addItem: function (sPropertyName, oControl, mPropertyBag) {
			return Promise.resolve();
		},

		/**
		 * Triggers any necessary follow-up steps that need to be taken after the removal of created items via <code>addItem</code>.
		 * The returned Boolean value inside the <code>Promise</code> can be used to prevent the default follow-up behavior of the SAPUI5 flexibility handling.
		 *
		 * @param {sap.ui.core.Control} oItem The control instance that was removed
		 * @param {sap.ui.mdc.Control} oControl Instance of a filter bar
		 * @param {Object} [mPropertyBag] Instance of property bag from SAPUI5 flexibility
		 * <b>Note:</b>
		 * The <code>addItem</code> Hook may be used during SAPUI5 flexibility change appliance and during runtime.
		 * Consequently the parameter <code>mPropertyBag</code> is only being passed once a change is being applied
		 * during flexibility processing. In runtime scenarios (such as opening a personalization dialog), this
		 * method might be called without the parameter <code>mPropertyBag</code>.
		 *
		 * @returns {Promise} Promise that resolves with <code>true</code>, <code>false</code> to allow/prevent default behavior of the change
		 * @public
		 */
		removeItem: function(oItem, oControl, mPropertyBag) {
			return Promise.resolve(true);
		}


	});

	return AggregationBaseDelegate;
}, /* bExport= */ true);
