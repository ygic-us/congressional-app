/*!
 * OpenUI5
 * (c) Copyright 2009-2020 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/base/util/restricted/_intersection"],function(_){"use strict";return function hasTag(c,t){var T=[].concat(t);return(Array.isArray(c.tags)&&_(T,c.tags).length===T.length);};});
