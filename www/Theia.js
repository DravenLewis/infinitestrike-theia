
// Empty constructor
function Theia() { }

// Plugin Code Here

var headers = {};
var responseHeaders = {};
var useURLFormEncoded = true;

var code = 700;
var message = "Unset";

var sent  = false;
var done = false;

/**
 * 
 * @param {String} key - key to be set
 * @param {Stirng} value - value of that key
 * 
 * Sets a HTTP header for the next request.
 */
Theia.prototype.setRequestHeader = function (key, value) {
    if(sent == true) console.error("Cannot Set header after Request Sent");
    headers[key] = value;
}
/**
 * 
 * @param {String} key - key of the header
 * @returns {String | undefined} - Value of the header
 * Gets one of the set headers
 */
Theia.prototype.getRequestHeader = function (key) {
    return headers[key];
}

/**
 * Clears all set headers
 */
Theia.prototype.clearRequestHeaders = function () {
    if(sent == true) console.error("Cannot modify headers after Request Sent");
    headers = {};
}


/**
 * Gets headers from response, is empty until request is sent.
 */
Theia.prototype.getResponseHeaders = function(){
    if(done == false) console.error("Cannot Read Headers until after request done!");
    return responseHeaders;
}

/**
 * 
 * @param {String} key - key of the header to get
 * @returns {String | undefined} - Value of that header, if it exists.
 * 
 * Gets the value of the header from the request. 
 */
Theia.prototype.getResponseHeader = function(key){
    if(done == false) console.error("Cannot Read Header until after request done!");
    return responseHeaders[key];
}

/**
 * Clear all response headers
 * !!! Note, this is an internal function and has no use to Implementation Programmers.
 */
Theia.prototype.clearResponseHeaders = function(){
    responseHeaders = {};
}


/**
 * Get Code of Response, only valid in method callback.
 */
Theia.prototype.getResponseCode = function(){
    if(done == false) console.error("Cannot Read property until after request done!");
    return code;
}

/** 
 * Get Message from server of Response, only valid in method callback.
*/
Theia.prototype.getResponseMessage = function(){
    if(done == false) console.error("Cannot Read property until after request done!");
    return message;
}

/**
 * 
 * @param {Boolean} useURLFE 
 * 
 * Sets whether or not we use 'application/json' or 'application/w-www-form-urlencoded' when
 * sending upload requests i.e. POST, PUT, DELETE
 */
Theia.prototype.setUseUrlFormEncoded = function (useURLFE = true) {
    if(sent == true) console.error("Cannot Set Proptery if Request has already been sent.");
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

    sent = true;

    let errCallback = (payload) => {
        
        var formattedString = new String(payload).replace('\'','"').replace('\"','"');
        var jsonResp = JSON.parse(formattedString);
        
        var payloadObject = parseJSON(jsonResp["resp"]);
        message = payloadObject.message;
        code = payloadObject.code;

        if(isJSON(jsonResp["resp"])){
            payload = parseJSON(payloadObject.data);
        }else{
            payload = jsonResp["resp"];
        }

        responseHeaders = parseJSON(jsonResp["head"]);
        done = true;
        callback(true, payload);
    }

    let okCallback = (payload) => {
        
        var formattedString = new String(payload).replace('\'','"').replace('\"','"');
        var jsonResp = JSON.parse(formattedString);
        
        var payloadObject = parseJSON(jsonResp["resp"]);
        message = payloadObject.message;
        code = payloadObject.code;
        
        if(isJSON(jsonResp["resp"])){
            payload = parseJSON(payloadObject.data);
        }else{
            payload = jsonResp["resp"];
        }

        responseHeaders = parseJSON(jsonResp["head"]);
        done = true;
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

    sent = true;

    let errCallback = (payload) => {

        var formattedString = new String(payload).replace('\'','"').replace('\"','"');
        var jsonResp = JSON.parse(formattedString);

        var payloadObject = parseJSON(jsonResp["resp"]);
        message = payloadObject.message;
        code = payloadObject.code;

        if(isJSON(jsonResp["resp"])){
            payload = parseJSON(payloadObject.data);
        }else{
            payload = jsonResp["resp"];
        }

        responseHeaders = parseJSON(jsonResp["head"]);
        done = true;
        callback(true, payload);
    }

    let okCallback = (payload) => {
        
        var formattedString = new String(payload).replace('\'','"').replace('\"','"');
        var jsonResp = JSON.parse(formattedString);
        
        var payloadObject = parseJSON(jsonResp["resp"]);
        message = payloadObject.message;
        code = payloadObject.code;
        
        if(isJSON(jsonResp["resp"])){
            payload = parseJSON(payloadObject.data);
        }else{
            payload = jsonResp["resp"];
        }

        responseHeaders = parseJSON(jsonResp["head"]);
        done = true;
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

    sent = true;

    let errCallback = (payload) => {
        
        var formattedString = new String(payload).replace('\'','"').replace('\"','"');
        var jsonResp = JSON.parse(formattedString);
        
        var payloadObject = parseJSON(jsonResp["resp"]);
        message = payloadObject.message;
        code = payloadObject.code;

        if(isJSON(jsonResp["resp"])){
            payload = parseJSON(payloadObject.data);
        }else{
            payload = jsonResp["resp"];
        }

        responseHeaders = parseJSON(jsonResp["head"]);
        done = true;
        callback(true, payload);
    }

    let okCallback = (payload) => {
        
        var formattedString = new String(payload).replace('\'','"').replace('\"','"');
        var jsonResp = JSON.parse(formattedString);
        
        var payloadObject = parseJSON(jsonResp["resp"]);
        message = payloadObject.message;
        code = payloadObject.code;
        
        if(isJSON(jsonResp["resp"])){
            payload = parseJSON(payloadObject.data);
        }else{
            payload = jsonResp["resp"];
        }

        responseHeaders = parseJSON(jsonResp["head"]);
        done = true;
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

    sent = true;

    let errCallback = (payload) => {
        
        var formattedString = new String(payload).replace('\'','"').replace('\"','"');
        var jsonResp = JSON.parse(formattedString);
        
        var payloadObject = parseJSON(jsonResp["resp"]);
        message = payloadObject.message;
        code = payloadObject.code;

        if(isJSON(jsonResp["resp"])){
            payload = parseJSON(payloadObject.data);
        }else{
            payload = jsonResp["resp"];
        }

        responseHeaders = parseJSON(jsonResp["head"]);
        done = true;
        callback(true, payload);
    }

    let okCallback = (payload) => {
        
        var formattedString = new String(payload).replace('\'','"').replace('\"','"');
        var jsonResp = JSON.parse(formattedString);
        
        var payloadObject = parseJSON(jsonResp["resp"]);
        message = payloadObject.message;
        code = payloadObject.code;
        
        if(isJSON(jsonResp["resp"])){
            payload = parseJSON(payloadObject.data);
        }else{
            payload = jsonResp["resp"];
        }

        responseHeaders = parseJSON(jsonResp["head"]);
        done = true;
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


// END PLUGIN CODE =====================

Theia.install = function () {
    window.Theia = new Theia();
    return window.Theia;
};

/**
 * @returns {TheiaRequest}
 * 
 * Creates a new TheiaRequest helper.
 */
Theia.getRequestHelper = function () {
    return new TheiaRequest(new Theia());
}


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
        theia.clearRequestHeaders();
        theia.setUseUrlFormEncoded(true);
        theia.clearResponseHeaders();
    }

    /**
     * 
     * @param {String} key - Key of header 
     * @param {String} value - Value of that header
     * 
     * Helper Function for Theia.setHeader(), sets internal Theia instance header.
     */
    this.setRequestHeader = (key, value) => {
        theia.setRequestHeader(key, value);
    }

    /**
     * 
     * @param {String} key - Key of requested header
     * @returns {String | undefined} header value
     * 
     * Helper function for Theia.getHeader(), gets header from internal Theia instance.
     */
    this.getRequestHeader = (key) => {
        return theia.getRequestHeader(key);
    }

    /**
     * Helper function for Theia.clearHeaders(), clears all headers from the internal Theia instance.
     */
    this.clearRequestHeaders = () => {
        theia.clearRequestHeaders();
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


    /**
     * Get Response Headers, only valid in response callback.
     */
    this.getResponseHeaders = () => {
        return theia.getResponseHeaders();
    }

    /**
     * 
     * @param {String} key - key of the header
     * @returns {String | undefined} - Header value or undefined. 
     * 
     * Gets the value of the response header, only works if request is done.
     */
    this.getResponseHeader = (key) => {
        return theia.getResponseHeader(key);
    }

    /**
     * Returns the response message from the theia instance, only works if request is done.
     */
    this.getResponseMessage = () => {
        return theia.getResponseMessage();
    }

    /**
     * Returns the response code from the theia instance, only works if request is done.
     */
    this.getResponseCode = () => {
        return theia.getResponseCode();
    }

    this.reset();
}


Theia.install = function () {
    window.Theia = new Theia();
    return window.Theia;
};

function parseJSON(string) {
    if((string + "") == "[object Object]"){ // this is if we are given json to start
        return string;
    }

    try {
        var jsonString = JSON.parse(string);
        return jsonString;
    } catch (e) {
        var jsonString = JSON.parse("{}");
        return jsonString;
    }
}

cordova.addConstructor(Theia.install);


