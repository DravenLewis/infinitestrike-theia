
// Empty constructor
function Theia() { }

// Plugin Code Here

var headers = {};
var useURLFormEncoded = true;
/**
 * 
 * @param {String} key - key to be set
 * @param {Stirng} value - value of that key
 * 
 * Sets a HTTP header for the next request.
 */
Theia.prototype.setHeader = function (key, value) {
    headers[key] = value;
}
/**
 * 
 * @param {String} key - key of the header
 * @returns {String | undefined} - Value of the header
 * Gets one of the set headers
 */
Theia.prototype.getHeader = function (key) {
    return headers[key];
}

/**
 * Clears all set headers
 */
Theia.prototype.clearHeaders = function () {
    headers = {};
}
/**
 * 
 * @param {Boolean} useURLFE 
 * 
 * Sets whether or not we use 'application/json' or 'application/w-www-form-urlencoded' when
 * sending upload requests i.e. POST, PUT, DELETE
 */
Theia.prototype.setUseUrlFormEncoded = function (useURLFE = true) {
    useURLFormEncoded = useURLFE;
}

/**
 * 
 * @param {String} urlEndpoint - The url in which our request points to.
 * @param {GetRequestCallback} callback - The callback method for our GET request.
 * 
 * Fires a GET Request
 */
Theia.prototype.get = function (urlEndpoint, callback = (err, payload) => { }) {

    let errCallback = (payload) => {
        var formattedString = new String(payload).replace('\'', '"');
        if (isJSON(formattedString)) {
            payload = JSON.parse(formattedString).data;
        } else {
            payload = formattedString;
        }
        callback(true, payload);
    }

    let okCallback = (payload) => {
        var formattedString = new String(payload).replace('\'', '"');
        if (isJSON(formattedString)) {
            payload = JSON.parse(formattedString).data;
        } else {
            payload = formattedString;
        }
        callback(false, payload);
    }

    cordova.exec(okCallback, errCallback, "Theia", "get", [{
        "useUFE": useURLFormEncoded,
        "url": urlEndpoint,
        "headers": JSON.stringify(headers)
    }]);
}
/**
 * @callback GetRequestCallback 
 * @param {Boolean} err - Callback error.
 * @param {JSON | String} payload - Callback Message
 */


/**
 * 
 * @param {String} urlEndpoint - The url to which our request points to.
 * @param {JSON} data - JSON Data to populate the request body.
 * @param {PostRequestCallback=} callback - Callback for our POST request (optional)
 * 
 * Fires a POST Request 
 */
Theia.prototype.post = function (urlEndpoint, data = {}, callback = (err, payload) => { }) {

    let errCallback = (payload) => {
        var formattedString = new String(payload).replace('\'', '"');
        if (isJSON(formattedString)) {
            payload = JSON.parse(formattedString).data;
        } else {
            payload = formattedString;
        }
        callback(true, payload);
    }

    let okCallback = (payload) => {
        var formattedString = new String(payload).replace('\'', '"');
        if (isJSON(formattedString)) {
            payload = JSON.parse(formattedString).data;
        } else {
            payload = formattedString;
        }
        callback(false, payload);
    }

    cordova.exec(okCallback, errCallback, "Theia", "post", [{
        "useUFE": useURLFormEncoded,
        "url": urlEndpoint,
        "headers": JSON.stringify(headers),
        "data": JSON.stringify(data)
    }]);
}
/**
 * 
 * @callback PostRequestCallback
 * @param {Boolean} err
 * @param {JSON | String} payload
 */

/**
* 
* @param {String} urlEndpoint - The url to which our request points to.
* @param {JSON} data - JSON Data to populate the request body.
* @param {PutRequestCallback=} callback - Callback for our PUT request (optional)
* 
* Fires a PUT Request 
*/
Theia.prototype.put = function (urlEndpoint, data = {}, callback = (err, payload) => { }) {

    let errCallback = (payload) => {
        var formattedString = new String(payload).replace('\'', '"');
        if (isJSON(formattedString)) {
            payload = JSON.parse(formattedString).data;
        } else {
            payload = formattedString;
        }
        callback(true, payload);
    }

    let okCallback = (payload) => {
        var formattedString = new String(payload).replace('\'', '"');
        if (isJSON(formattedString)) {
            payload = JSON.parse(formattedString).data;
        } else {
            payload = formattedString;
        }
        callback(false, payload);
    }

    cordova.exec(okCallback, errCallback, "Theia", "put", [{
        "useUFE": useURLFormEncoded,
        "url": urlEndpoint,
        "headers": JSON.stringify(headers),
        "data": JSON.stringify(data)
    }]);
}

/**
 * 
 * @callback PutRequestCallback
 * @param {Boolean} err
 * @param {JSON | String} payload
 */


/**
 * 
 * @param {String} urlEndpoint - The url to which our request points to.
 * @param {JSON} data - JSON Data to populate the request body.
 * @param {DeleteRequestCallback=} callback - Callback for our DELETE request (optional)
 * 
 * Fires a DELETE Request 
 */
Theia.prototype.delete = function (urlEndpoint, data = {}, callback = (err, payload) => { }) {

    let errCallback = (payload) => {
        var formattedString = new String(payload).replace('\'', '"');
        if (isJSON(formattedString)) {
            payload = JSON.parse(formattedString).data;
        } else {
            payload = formattedString;
        }
        callback(true, payload);
    }

    let okCallback = (payload) => {
        var formattedString = new String(payload).replace('\'', '"');
        if (isJSON(formattedString)) {
            payload = JSON.parse(formattedString).data;
        } else {
            payload = formattedString;
        }
        callback(false, payload);
    }

    cordova.exec(okCallback, errCallback, "Theia", "delete", [{
        "useUFE": useURLFormEncoded,
        "url": urlEndpoint,
        "headers": JSON.stringify(headers),
        "data": JSON.stringify(data)
    }]);
}

/**
 * 
 * @callback DeleteRequestCallback
 * @param {Boolean} err
 * @param {JSON | String} payload
 */

// REMOVE IF BROKEN

/**
 * @returns {TheiaRequest}
 * 
 * Creates a new TheiaRequest helper.
 */
Theia.prototype.getRequestHelper = function () {
    return new TheiaRequest(this);
}

// END PLUGIN CODE =====================

Theia.install = function () {
    window.Theia = new Theia();
    return window.Theia;
};

function isJSON(string) {
    try {
        JSON.parse(string);
        return true;
    } catch (e) {
        return false;
    }
}

// NEW STUFF, REMOVE IF BUGS
// ================================================================================================================


/**
 * 
 * @param {Theia} theia - Theia Instance.
 * 
 * Request Helper for Theia based requests.
 */
function TheiaRequest(theia) {

    /**
     * Resets the attached Theia instance, clearing all headers and reseting form encoding.
     */
    this.reset = () => {
        theia.clearHeaders();
        theia.setUseUrlFormEncoded(true)
    }

    /**
     * 
     * @param {String} key - Key of header 
     * @param {String} value - Value of that header
     * 
     * Helper Function for Theia.setHeader(), sets internal Theia instance header.
     */
    this.setHeader = (key, value) => {
        theia.setHeader(key, value);
    }

    /**
     * 
     * @param {String} key - Key of requested header
     * @returns {String | undefined} header value
     * 
     * Helper function for Theia.getHeader(), gets header from internal Theia instance.
     */
    this.getHeader = (key) => {
        return theia.getHeader(key);
    }

    /**
     * Helper function for Theia.clearHeaders(), clears all headers from the internal Theia instance.
     */
    this.clearHeaders = () => {
        theia.clearHeaders();
    }

    /**
     * 
     * @param {Boolean} encoded - should this request use urlencoding.
     * 
     * Helper function for Theia.setUseUrlFormEncoded(), sets wether or not the request Content-Type is
     * 'application/json' or 'application/x-www-form-urlencoded'
     */
    this.setUseUrlFormEncoded = (encoded) => {
        theia.setUseUrlFormEncoded(encoded);
    }

    /**
     * 
     * @param {String} urlEndpoint - Endpoint for our request.
     * @param {GetRequestCallback} callback - Callback for Request, with request response.
     * 
     * Helper Function for Theia.get(), fires a get request to the provided endpoint.
     */
    this.get = (urlEndpoint, callback = (err, payload, payloadJSON) => { }) => {
        theia.get(urlEndpoint, data, (err, payload) => {
            callback(err, payload, parseJSON(payload));
        });
    }
    /**
     * @callback GetRequestCallback;
     * @param {Boolean} err - if the request resulted in an error
     * @param {String} payload - raw string representation of the response
     * @param {JSON} payloadJSON - json representation (if available) of the response.
     */

    /**
     * 
     * @param {String} urlEndpoint - Endpoint for our request
     * @param {JSON} data - Request Body of our request in JSON
     * @param {PostRequestCallback} callback - Callback for Request, with request response. (optional)
     * 
     * Helper function for Theia.post(), sends a POST request to the provided endpoint
     */
    this.post = (urlEndpoint, data = {}, callback = (err, payload, payloadJSON) => { }) => {
        theia.post(urlEndpoint, data, (err, payload) => {
            callback(err, payload, parseJSON(payload));
        });
    }
    /**
     * @callback PostRequestCallback;
     * @param {Boolean} err - if the request resulted in an error
     * @param {String} payload - raw string representation of the response
     * @param {JSON} payloadJSON - json representation (if available) of the response.
     */

    /**
    * 
    * @param {String} urlEndpoint - Endpoint for our request
    * @param {JSON} data - Request Body of our request in JSON
    * @param {PutRequestCallback} callback - Callback for Request, with request response. (optional)
    * 
    * Helper function for Theia.put(), sends a PUT request to the provided endpoint
    */
    this.put = (urlEndpoint, data = {}, callback = (err, payload, payloadJSON) => { }) => {
        theia.put(urlEndpoint, data, (err, payload) => {
            callback(err, payload, parseJSON(payload));
        });
    }
    /**
     * @callback PutRequestCallback;
     * @param {Boolean} err - if the request resulted in an error
     * @param {String} payload - raw string representation of the response
     * @param {JSON} payloadJSON - json representation (if available) of the response.
     */

    /**
    * 
    * @param {String} urlEndpoint - Endpoint for our request
    * @param {JSON} data - Request Body of our request in JSON
    * @param {DeleteRequestCallback} callback - Callback for Request, with request response. (optional)
    * 
    * Helper function for Theia.delete(), sends a DELETE request to the provided endpoint
    */
    this.delete = (urlEndpoint, data = {}, callback = (err, payload, payloadJSON) => { }) => {
        theia.delete(urlEndpoint, data, (err, payload) => {
            callback(err, payload, parseJSON(payload));
        });
    }
    /**
     * @callback DeleteRequestCallback;
     * @param {Boolean} err - if the request resulted in an error
     * @param {String} payload - raw string representation of the response
     * @param {JSON} payloadJSON - json representation (if available) of the response.
     */
    this.reset();
}


Theia.install = function () {
    window.Theia = new Theia();
    return window.Theia;
};

function parseJSON(string) {
    try {
        var jsonString = JSON.parse(string);
        return jsonString;
    } catch (e) {
        var jsonString = JSON.parse("{}");
        return jsonString;
    }
}

cordova.addConstructor(Theia.install);


