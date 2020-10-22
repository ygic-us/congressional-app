/*!
 * OpenUI5
 * (c) Copyright 2009-2020 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/ui/base/ManagedObject"],function(M){"use strict";var D=M.extend("sap.ui.integration.Designtime",{metadata:{library:"sap.ui.integration"},constructor:function(s){M.apply(this,[]);this.settings=s;}});D.prototype.init=function(){this._oCard=null;};D.prototype.exit=function(){this._oCard=null;};D.prototype.onCardReady=function(c,i){this._oCard=c;this._oInternalCardInstance=i;};D.prototype._readyPromise=function(c,i){this.onCardReady(c,i);return Promise.resolve();};D.prototype.getCard=function(){return this._oCard;};return D;});
