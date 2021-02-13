
// RECODE ==================================================================================================

function Theia(){
    this.requestHeaders = this.responseHeaders = {};
    this.useURLFormEncoded = true;
    this.code = 700;
    this.message = "";
    this.sent = false;
    this.done = false;
};

/**
 * 
 * @param {Theia} requestInstance 
 * 
 */
function TheiaRequest(requestInstance){
    this.theia = requestInstance;
    this.reset();
}

Theia.install = function(){
    window.Theia = new Theia();
    return window.theia;
}

// Helper Functions

const isJSON = function(jsonString){
    try {
        JSON.parse(string);
        return true;
    } catch (e) {
        return false;
    }
}

const parseJSON = function(string) {
    // this is if we are given json to start
    if((string + "") == "[object Object]"){ 
        return string;
    }

    try {
        var jsonString = JSON.parse(string);
        return jsonString;
    } catch (e) {
        var jsonString = {};
        return jsonString;
    }
}

/**
 * 
 * @param {Theia} theia 
 * @param {JSON | String} payload 
 * @param {Function} callback 
 */
const defaultErrorCallback = function(theia, payload, callback = (err,payload) => {}){
    var formattedString = new String(payload).replace('\'','"').replace('\"','"');
    var jsonResp = JSON.parse(formattedString);
        
    var payloadObject = parseJSON(jsonResp["resp"]);
        theia.message = payloadObject.message;
        theia.code = payloadObject.code;

        if(isJSON(jsonResp["resp"])){
            payload = parseJSON(payloadObject.data);
        }else{
            payload = jsonResp["resp"];
        }

        theia.responseHeaders = parseJSON(jsonResp["head"]);
        theia.done = true;
        callback(true, payload);
};

/**
 * 
 * @param {Theia} theia 
 * @param {JSON | String} payload 
 * @param {Function} callback 
 */
const defaultOkayCallback = function(theia, payload, callback = (err,payload) => {}){
    var formattedString = new String(payload).replace('\'','"').replace('\"','"');
    var jsonResp = JSON.parse(formattedString);
        
    var payloadObject = parseJSON(jsonResp["resp"]);
        theia.message = payloadObject.message;
        theia.code = payloadObject.code;

        if(isJSON(jsonResp["resp"])){
            payload = parseJSON(payloadObject.data);
        }else{
            payload = jsonResp["resp"];
        }

        theia.responseHeaders = parseJSON(jsonResp["head"]);
        theia.done = true;
        callback(false, payload);
};

// =========================================================
// Begin Theia JS Wrapper Implementation
// =========================================================


Theia.prototype.getRequestHelper = function(){
    return new TheiaRequest(new Theia());
}

Theia.prototype.getRequestHeader = function(key){
    return this.requestHeaders[key];
}

Theia.prototype.getRequestHeaders = function(){
    return this.requestHeaders;
}

Theia.prototype.setRequestHeader = function(key, value){
    if(this.sent == true){
        throw "Cannot modify headers after they have been sent.";
    }
    this.requestHeaders[key] = value;
}

Theia.prototype.getResponseHeader = function(key){
    if(this.done == false){
        throw "Cannot read headers before they are recieved."
    }
    return this.responseHeaders[key];
}

Theia.prototype.getResponseHeaders = function(){
    if(this.done == false){
        throw "Cannot read headers before they are recieved."
    }
    return this.responseHeaders;
}

Theia.prototype.clearRequestHeaders = function(){
    if(this.sent == true){
        throw "Cannot modify headers after they have been sent.";
    }
    this.requestHeaders = {};
}

Theia.prototype.clearResponseHeaders = function(){
    this.responseHeaders = {};
}

Theia.prototype.getResponseCode = function(){
    if(this.done == false){
        throw "Cannot read headers before they are recieved."
    }
    return this.code;
}

Theia.prototype.getResponseMessage = function(){
    if(this.done == false){
        throw "Cannot read headers before they are recieved."
    }
    return this.message;
}

Theia.prototype.setUseURLFormEncoded = function(useURLFormEncoded){
    if(this.sent == true){
        throw "Cannot modify headers after they have been sent.";
    }
    this.useURLFormEncoded = useURLFormEncoded;
}

Theia.prototype.get = function(urlEndpoint, callback = (error, payload) => {}){

    if(this.sent == true){
        throw "Cannot make multiple requests from the same object."
    }

    this.sent = true;

    let okCallback = (payload) => {defaultOkayCallback(this,payload,callback);}
    let errCallback = (payload) => {defaultErrorCallback(this,payload,callback);}

    cordova.exec(okCallback, errCallback, "Theia", "get", [{
        "useUFE": this.useURLFormEncoded,
        "url": urlEndpoint,
        "headers": JSON.stringify(this.requestHeaders),
        "data" : "{}"
    }]);

};

Theia.prototype.post = function(urlEndpoint, data = {}, callback = (error,payload)){

    if(this.sent == true){
        throw "Cannot make multiple requests from the same object."
    }

    this.sent = true;

    let okCallback = (payload) => {defaultOkayCallback(this,payload,callback);}
    let errCallback = (payload) => {defaultErrorCallback(this,payload,callback);}

    cordova.exec(okCallback, errCallback, "Theia", "post", [{
        "useUFE": this.useURLFormEncoded,
        "url": urlEndpoint,
        "headers": JSON.stringify(this.requestHeaders),
        "data" : JSON.stringify(data)
    }]);

};

Theia.prototype.put = function(urlEndpoint, data = {}, callback = (error,payload)){

    if(this.sent == true){
        throw "Cannot make multiple requests from the same object."
    }

    this.sent = true;

    let okCallback = (payload) => {defaultOkayCallback(this,payload,callback);}
    let errCallback = (payload) => {defaultErrorCallback(this,payload,callback);}

    cordova.exec(okCallback, errCallback, "Theia", "put", [{
        "useUFE": this.useURLFormEncoded,
        "url": urlEndpoint,
        "headers": JSON.stringify(this.requestHeaders),
        "data" : JSON.stringify(data)
    }]);

};

Theia.prototype.delete = function(urlEndpoint, data = {}, callback = (error,payload)){

    if(this.sent == true){
        throw "Cannot make multiple requests from the same object."
    }

    this.sent = true;

    let okCallback = (payload) => {defaultOkayCallback(this,payload,callback);}
    let errCallback = (payload) => {defaultErrorCallback(this,payload,callback);}

    cordova.exec(okCallback, errCallback, "Theia", "delete", [{
        "useUFE": this.useURLFormEncoded,
        "url": urlEndpoint,
        "headers": JSON.stringify(this.requestHeaders),
        "data" : JSON.stringify(data)
    }]);

};

// =========================================================
// Begin TheiaRequest Definition
// =========================================================

TheiaRequest.prototype.reset = function(){
    this.theia.clearRequestHeaders();
    this.theia.clearResponseHeaders();
    this.theia.setUseURLFormEncoded(true);
}

TheiaRequest.prototype.setRequestHeader = function(key,value){
    this.theia.setRequestHeader(key,value);
}

TheiaRequest.prototype.getRequestHeaders = function(){
    return this.theia.getRequestHeaders();
}

TheiaRequest.prototype.getRequestHeader = function(key){
    return this.theia.getRequestHeader(key);
}

TheiaRequest.prototype.getResponseHeaders = function(){
    return this.theia.getResponseHeaders();
}

TheiaRequest.prototype.getResponseHeader = function(key){
    return this.theia.getResponseHeader(key);
}

TheiaRequest.prototype.getResponseCode = function(){
    return this.theia.getResponseCode();
}

TheiaRequest.prototype.getResponseMessage = function(){
    return this.theia.getResponseMessage();
}

TheiaRequest.prototype.setURLFormEncoded = function(useURLFormEncoded){
    this.theia.useURLFormEncoded(useURLFormEncoded);
}

TheiaRequest.prototype.get = function(urlEndpoint, callback = (err,payload,payloadJSON) => {}){
    this.theia.get(urlEndpoint,(error,payload) => {
        callback(error,payload,parseJSON(parseJSON(payload).data));
    });
}

TheiaRequest.prototype.post = function(urlEndpoint, data = {}, callback = (err,payload,payloadJSON) => {}){
    this.theia.post(urlEndpoint, data,(error,payload) => {
        callback(error,payload,parseJSON(parseJSON(payload).data));
    });
}

TheiaRequest.prototype.put = function(urlEndpoint, data = {}, callback = (err,payload,payloadJSON) => {}){
    this.theia.post(urlEndpoint, data,(error,payload) => {
        callback(error,payload,parseJSON(parseJSON(payload).data));
    });
}

TheiaRequest.prototype.delete = function(urlEndpoint, data = {}, callback = (err,payload,payloadJSON) => {}){
    this.theia.delete(urlEndpoint, data,(error,payload) => {
        callback(error,payload,parseJSON(parseJSON(payload).data));
    });
}


//================================================================================
// Interface with Cordova and Node
//================================================================================

cordova.addConstructor(Theia.install);
module.exports = Theia;
