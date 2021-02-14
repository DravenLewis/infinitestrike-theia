# InfiniteStrike Theia

<img src = "https://raw.githubusercontent.com/dravenlewis/infinitestrike-theia/main/theia-banner.png" width = "50%" alt = "InfiniteStrike-Theia Banner"/>

A simple HTTP / HTTPS request handler for Cordova based Android Apps.

## Installation

```sh 
cordova plugin add https://github.com/DravenLewis/infinitestrike-theia.git 
```

# Preface
After wrestling with CORS errors in my Cordova application, I set out to look for a plugin to allow me to make native http and https requests.
unfortunatly the ones i found did not give me the results I was looking for, aside from the fact that most of them are discontinued and broken.
I then set out to create a plugin of my own, and this is it! It is my first cordova plugin and only offers basic features, and may include bugs.

### *Requires Cordova 3.0.0+*

# How it works
Infinite Strike: Theia is a Cordova Plugin around a wrapper for the native HttpUrlConnection and allows us to make 4 main request types "GET", "POST", "PUT", "DELETE". All examples allow for a optional callback to exist that returns if the request ends in error (internal exception or 400+ HTTP 1.1 Code). All requests also allow you to get data in the form of JSON or text with the `payload` field. `payload` can either be JSON or Raw Text from the Server, `payloadJSON` can either be JSON or undefined, as not all raw text can be converted into json.

##### *Note this plug-in requires that the Device be ready*

## GET demo
```javascript
  // Example get demo
  window.onload = () => {
      document.addEventListener("deviceready",(ev) => {
          var request = Theia.getRequestHelper();
          request.get("https://jsonplaceholder.typicode.com/posts",(err,payload,payloadJSON) => {
            if(!err){
              console.log(payloadJSON);
            }
          });
      });
  }
```

## POST demo
```javascript
// example POST demo
window.onload = () => {
      document.addEventListener("deviceready",(ev) => {
          var request = Theia.getRequestHelper();
          request.post("https://jsonplaceholder.typicode.com/posts",{
            "example_data" : 1234,
            "source" : "github"
          },(err,payload,payloadJSON) => {
            if(!err){
              console.log(payloadJSON);
            }
          });
      });
  }
```

## PUT demo
```javascript
// example PUT demo
window.onload = () => {
      document.addEventListener("deviceready",(ev) => {
          var request = Theia.getRequestHelper();
          request.put("https://jsonplaceholder.typicode.com/posts",{
            "name" : "John Doe",
            "uid" : 8 
          },(err,payload,payloadJSON) => {
            if(!err){
              console.log(payloadJSON);
            }
          });
      });
  }
```

## DELETE demo
```javascript
// example DELETE demo
window.onload = () => {
      document.addEventListener("deviceready",(ev) => {
          var request = Theia.getRequestHelper();
          request.delete("https://jsonplaceholder.typicode.com/posts",{
            "post-id" : 79
          },(err,payload,payloadJSON) => {
            if(!err){
              console.log(payloadJSON);
            }
          });
      });
  }
```


## Managing Headers

You can manage request headers before the request has been sent. Response Headers are Read-Only and changing them has no effect,
they are also `undefined` prior to a request finishing.

```javascript
  window.onload = () => {
    document.addEventListener("deviceready",(ev) => {
      var request = Theia.getRequestHelper();
      
      // Set header example
      request.setRequestHeader("Accepts","application/json");
      
      // Get header example
      var acceptsHeaderValue = request.getRequestHeader("Accepts");
      
      // Clear Headers
      request.clearRequestHeaders();
    });
  }

  // example of reading headers
  window.onload = () => {
      document.addEventListener("deviceready",(ev) => {
          var request = Theia.getRequestHelper();
          request.post("http://www.exampledomian.com/api/v1/demo",{
              "key" : "value"
          },(error, payload, payloadJSON) => {
              var headers = request.getResponseHeaders();
              var contentType = headers["Content-Type"];
              // or
              var contentType = request.getResonseHeader("Content-Type");
          });
      })
  }
```

### Response Meta

We have added the ability to read response meta-data. Aside from headers, you can get the response code, and the response message!

```javascript
    window.onload = () => {
      document.addEventListener("deviceready",(ev) => {
          var request = Theia.getRequestHelper();
          request.post("http://www.exampledomian.com/api/v1/demo",{
              "key" : "value"
          },(error, payload, payloadJSON) => {
              // HTTP 1.1 Code
              var code = request.getResponseCode();

              // HTTP 1.1 Message, or custom server message.
              var message = request.getResponseMessage();
          });
      })
  }

```

# Strange Quirk

By default the Request handler uses 'application/x-www-form-urlencoded' as most websites expect that, but our implementation is 1D so your
json body cannot have sub objects, if you requre sub objects, and your endpoint accepts JSON you can use this feature.

```javascript
...
request.setUseUrlFormEncoded (true);
...
```

if `true` the sent data would look like this `key1=value1&key2=value2&key3=value3` if `false` the data would look like this:
```json
  {
    "key1" : "value1",
    "key2" : "value2",
    "key3" : "value3"
  }
```










