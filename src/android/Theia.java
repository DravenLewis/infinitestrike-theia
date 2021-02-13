package io.infinitestrike.http;


// Cordova-required packages
import com.google.gson.Gson;
import com.google.gson.JsonObject;

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
                            // output request json.
                            JsonObject obj = new JsonObject();
                            obj.addProperty("resp" , arg0); // [0] Maybe Json
                            obj.addProperty("head", request.getResponseHeaders()); // [1] Always Json
                            callbackContext.success(new Gson().toJson(obj));

                            // original code
                            //callbackContext.success(arg0);
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
                            JsonObject obj = new JsonObject();
                            obj.addProperty("resp" , arg0); // [0] Maybe Json
                            obj.addProperty("head", request2.getResponseHeaders()); // [1] Always Json
                            callbackContext.success(new Gson().toJson(obj));

                            // original code
                            //callbackContext.success(arg0);
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
                            JsonObject obj = new JsonObject();
                            obj.addProperty("resp" , arg0); // [0] Maybe Json
                            obj.addProperty("head", request3.getResponseHeaders()); // [1] Always Json
                            callbackContext.success(new Gson().toJson(obj));

                            // original code
                            //callbackContext.success(arg0);
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
                            JsonObject obj = new JsonObject();
                            obj.addProperty("resp" , arg0); // [0] Maybe Json
                            obj.addProperty("head", request4.getResponseHeaders()); // [1] Always Json
                            callbackContext.success(new Gson().toJson(obj));

                            // original code
                            //callbackContext.success(arg0);
                        }
                    });
                    break;
                default:
                    JsonObject errorData = new JsonObject();
                    errorData.addProperty("error",true);
                    errorData.addProperty("message","Unknown Action: \"" + action + "\"");
                    JsonObject objResp = new JsonObject();
                    objResp.addProperty("code",TheiaRequest.INTERNAL_REQUEST_ERROR);
                    objResp.addProperty("message","Unknown Action: \"" + action + "\"");
                    objResp.add("data",errorData);
                    JsonObject obj = new JsonObject();
                    obj.add("resp" , objResp); // [0] Maybe Json
                    obj.add("head", new JsonObject()); // [1] Always Json
                    callbackContext.error(new Gson().toJson(obj));
                    break;
            }
        } catch (Exception e) {
            JsonObject errorData = new JsonObject();
            errorData.addProperty("error",true);
            errorData.addProperty("message",e.getClass().getName() + " : "+ e.getMessage());
            errorData.addProperty("stacktrace",Theia.stackTracetoString(e.getStackTrace()));
            JsonObject objResp = new JsonObject();
            objResp.addProperty("code",TheiaRequest.INTERNAL_REQUEST_ERROR);
            objResp.addProperty("message",e.getClass().getName() + " : "+ e.getMessage());
            objResp.add("data",errorData);
            JsonObject obj = new JsonObject();
            obj.add("resp" , objResp); // [0] Maybe Json
            obj.add("head", new JsonObject()); // [1] Always Json
            callbackContext.error(new Gson().toJson(obj));
            handler.requestCompleteCallback(null);
        }

        handler.requestCompleteCallback(null);
    }

    public static final String stackTracetoString(StackTraceElement[] elements){
        String result = "";
        for(StackTraceElement e : elements){
            result += e.getClassName() + "#" + e.getMethodName() + "; on Line: " + e.getLineNumber() + "\n";
        }
        return result;
    }
}