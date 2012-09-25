/**
 File:
 namespace.js
 Created By:
 Mario Gonzalez - mariogonzalez@gmail.com
 Project:
 ChuClone
 Abstract:
 Standard javascript namespace and extend methods

 Basic Usage:

 License:
 Creative Commons Attribution-NonCommercial-ShareAlike
 http://creativecommons.org/licenses/by-nc-sa/3.0/
 */
(function () {
    window.namespace = function (ns_string) {
        var parent = null;
        var parts = ns_string.split('.');
        var len = parts.length;

        for (var i = 0; i < len; i += 1) {
            var singlePart = parts[i];
            if(i == 0 && window[singlePart] == undefined ) {
                parent = window[singlePart] = {};
                continue;
            }

            parent = window[singlePart];
            // create a property if it doesn't exist
            if (typeof parent[singlePart] === "undefined") {
                parent[singlePart] = {};
            }
            parent = parent[singlePart];

        }
        return parent;
    };

    /**
     * Allows a simple inheritance model
     * based on http://www.kevs3d.co.uk/dev/canvask3d/scripts/mathlib.js
     */
    window.extend = function (subc, superc) {
        var subcp = subc.prototype;

        var F = function () {};
        F.prototype = superc.prototype;

        subc.prototype = new F();       // chain prototypes.
        subc.superclass = superc.prototype;
        subc.prototype.constructor = subc;

        if (superc.prototype.constructor === Object.prototype.constructor) {
            superc.prototype.constructor = superc;
        }

        // los metodos de superc, que no esten en esta clase, crear un metodo que
        // llama al metodo de superc.
        for (var method in subcp) {
            if (subcp.hasOwnProperty(method)) {
                subc.prototype[method] = subcp[method];

            }
        }
    };
}());