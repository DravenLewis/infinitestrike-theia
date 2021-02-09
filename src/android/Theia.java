package io.infinitestrike.http;


// Cordova-required packages
import org.apache.cordova.CallbackContext;
import org.apache.cordova.CordovaPlugin;
import org.apache.cordova.PluginResult;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

public class Theia extends CordovaPlugin {

    @Override
    public boolean execute(String action, JSONArray args, final CallbackContext callbackContext) {
        
        cordova.getThreadPool().execute(new Runnable() {
            @Override
            public void run() {
                executeCallback(action, args, callbackContext, new TheiaRequest.TheiaRequestHandler() {
                    @Override
                    public void requestCompleteCallback(String serializedData) {
                        PluginResult pluginResult = new PluginResult(PluginResult.Status.OK);
                        callbackContext.sendPluginResult(pluginResult);
                    }
                });
            }
        });

        return true;
    }


    public void executeCallback(String action, JSONArray args, CallbackContext callbackContext, TheiaRequest.TheiaRequestHandler handler){
        try {

            JSONObject options = args.getJSONObject(0);

            String headers = options.getString("headers");
            String data = options.getString("data");
            String url = options.getString("url");
            String useUFE = options.getString("useUFE");

            switch (action.toLowerCase()) {
                case "get":
                    TheiaRequest request = new TheiaRequest(url);
                    request.setHeadersFromJSONString(headers);
                    request.get();
                    request.send(new TheiaRequest.TheiaRequestHandler() {
                        @Override
                        public void requestCompleteCallback(String arg0) {
                            // TODO Auto-generated method stub
                            // output request json.
                            callbackContext.success(arg0);
                        }
                    });
                    break;
                case "post":
                    TheiaRequest request2 = new TheiaRequest(url);
                    request2.setHeadersFromJSONString(headers);
                    request2.useFormEncoding(Boolean.parseBoolean(useUFE));
                    request2.post(data);
                    request2.send(new TheiaRequest.TheiaRequestHandler() {
                        @Override
                        public void requestCompleteCallback(String arg0) {
                            // output request json.
                            callbackContext.success(arg0);
                        }
                    });
                    break;
                case "put":
                    TheiaRequest request3 = new TheiaRequest(url);
                    request3.setHeadersFromJSONString(headers);
                    request3.useFormEncoding(Boolean.parseBoolean(useUFE));
                    request3.put(data);
                    request3.send(new TheiaRequest.TheiaRequestHandler() {
                        @Override
                        public void requestCompleteCallback(String arg0) {
                            // output request json.
                            callbackContext.success(arg0);
                        }
                    });
                    break;
                case "delete":
                    TheiaRequest request4 = new TheiaRequest(url);
                    request4.setHeadersFromJSONString(headers);
                    request4.useFormEncoding(Boolean.parseBoolean(useUFE));
                    request4.delete(data);
                    request4.send(new TheiaRequest.TheiaRequestHandler() {
                        @Override
                        public void requestCompleteCallback(String arg0) {
                            // output request json.
                            callbackContext.success(arg0);
                        }
                    });
                    break;
                default:
                    callbackContext.error("{\"error\" : true, \"message\" : \"Unknown Action: "+action+" \"}");
                    break;
            }
        } catch (Exception e) {
            callbackContext.error("{\"error\" : true, \"message\" : \""+e.getMessage()+"\"}");
            handler.requestCompleteCallback(null);
        }

        handler.requestCompleteCallback(null);
    }
}