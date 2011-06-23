/**
File:
	ZOA.js
Created By:
	Mario Gonzalez
Project:
	ZOA
Abstract:
	This is the core module for ZOA. It contains the namespace method, and extend method

Basic Usage:
 	This class is not instantiated
Version:
	1.0
*/
ZOA = (typeof ZOA === 'undefined') ? {} : ZOA;

/**
 * Allows a package to create a namespace within ZOA
 * From Javascript Patterns book
 * @param ns_string
 */
ZOA.namespace = function(ns_string)
{
	var parts = ns_string.split('.'),
		parent = ZOA,
		i = 0;

	// strip redundant leading global
	if (parts[0] === "ZOA") {
		parts = parts.slice(1);
	}

	var len = parts.length;
	for (i = 0; i < len; i += 1) {
		var singlePart = parts[i];
		// create a property if it doesn't exist
		if (typeof parent[singlePart] === "undefined") {
		   parent[singlePart] = {};
		}
		parent = parent[singlePart];
	}
	return parent;
};