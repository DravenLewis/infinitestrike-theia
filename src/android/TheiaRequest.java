
package io.infinitestrike.http;

import com.google.gson.Gson;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;


import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.net.*;
import java.nio.charset.StandardCharsets;
import java.util.HashMap;
import java.util.Map;
import java.util.Scanner;
import java.util.Set;

public class TheiaRequest {

    public static final int INTERNAL_REQUEST_ERROR = 700;

    private static final int REQUEST_GET = 0,
            REQUEST_POST = 1,
            REQUEST_PUT = 2,
            REQUEST_DELETE = 3;

    private static final String[] REQUEST_NMONICS = new String[]{
      "GET","POST","PUT","DELETE"
    };

    private HashMap<String, String> headers = new HashMap<String, String>();
    private String requestBody = "";
    private int requestType = -1;
    private boolean useFormEncoding = false;
    private HttpURLConnection connection = null;

    private final URL urlEndpoint;
    private final boolean isHTTP;
    private final String hostname;
    private final String path;
    private final String charset = StandardCharsets.UTF_8.name();

    public TheiaRequest(URL url){
        this.urlEndpoint = url;
        this.isHTTP = this.urlEndpoint.toString().startsWith("https://");
        this.hostname = this.urlEndpoint.getHost();
        this.path = this.urlEndpoint.getPath();
    }

    public TheiaRequest(String url) throws MalformedURLException {
        this(new URL(url));
    }

    public TheiaRequest setHeader(String key, Object value){
        this.headers.put(key,value.toString());
        return this;
    }

    public String getHeader(String key){
        return this.headers.get(key);
    }

    public TheiaRequest setHeadersFromJSONString(String s){
        JsonObject  obj = JsonParser.parseString(s).getAsJsonObject();
        Set<Map.Entry<String, JsonElement>> entrySet = obj.entrySet();
        for(Map.Entry<String, JsonElement> entry : entrySet){
            this.setHeader(entry.getKey(),entry.getValue());
        }
        return this;
    }

    public TheiaRequest get(){
        this.requestType = REQUEST_GET;
        return this;
    }

    public TheiaRequest post(String requestBody){
        // Content-Type : application/x-www-form-urlencoded
        this.requestType = REQUEST_POST;
        this.requestBody = (this.useFormEncoding) ? TheiaRequest.jsonToURLFormEncoding(requestBody) : requestBody;
        this.setHeader("Content-Type", ((this.useFormEncoding) ? "application/x-www-form-urlencoded" : "application/json") + ",charset=" + this.charset);
        return this;
    }

    public TheiaRequest put(String requestBody){
        // Content-Type : application/x-www-form-urlencoded
        this.requestType = REQUEST_PUT;
        this.requestBody = (this.useFormEncoding) ? TheiaRequest.jsonToURLFormEncoding(requestBody) : requestBody;
        this.setHeader("Content-Type", ((this.useFormEncoding) ? "application/x-www-form-urlencoded" : "application/json") + ",charset=" + this.charset);
        return this;
    }

    public TheiaRequest delete(String requestBody){
        // Content-Type : application/x-www-form-urlencoded
        this.requestType = REQUEST_DELETE;
        this.requestBody = (this.useFormEncoding) ? TheiaRequest.jsonToURLFormEncoding(requestBody) : requestBody;
        this.setHeader("Content-Type", ((this.useFormEncoding) ? "application/x-www-form-urlencoded" : "application/json") + ",charset=" + this.charset);
        return this;
    }

    public TheiaRequest useFormEncoding(boolean useFormEncoding){
        this.useFormEncoding = useFormEncoding;
        if(this.requestType > REQUEST_GET){
            // set this here in case, one of the upload methods are called first.
            this.setHeader("Content-Type", ((this.useFormEncoding) ? "application/x-www-form-urlencoded" : "application/json") + ",charset=" + this.charset);
        }
        return this;
    }

    public void send(TheiaRequestHandler handler){
        if(this.requestType < 0){
            throw new IllegalStateException("Cannot Send Request without a method.");
        }else{
            try {
                this.connection = (HttpURLConnection) this.urlEndpoint.openConnection();
                connection.setRequestProperty("Accept-Charset",this.charset);
                connection.setRequestMethod(REQUEST_NMONICS[this.requestType]);
                connection.setDoOutput(true);
                connection.setDoInput(true);
                this.setRequestHeaders(connection);
                switch (this.requestType) {
                    case REQUEST_GET: // Get Request Done...
                        InputStream getRequestResponse = connection.getInputStream();
                        try(Scanner scan = new Scanner(getRequestResponse)){
                            final String getRequestResponseBody = scan.useDelimiter("\\A").next();
                            final int responseCode = connection.getResponseCode();
                            JsonObject obj = new JsonObject();
                            obj.addProperty("code",responseCode);
                            obj.addProperty("message",connection.getResponseMessage());
                            obj.addProperty("data",getRequestResponseBody);

                            handler.requestCompleteCallback(new Gson().toJson(obj));
                        }
                        break;
                    case REQUEST_POST:
                    case REQUEST_PUT:
                    case REQUEST_DELETE:
                        connection.setRequestProperty("Content-Length","" + this.requestBody.length());
                        try(OutputStream stream = connection.getOutputStream()){
                            stream.write(this.requestBody.getBytes());
                        }
                        InputStream uploadRequestResponse = connection.getInputStream();
                        try(Scanner scan = new Scanner(uploadRequestResponse)){
                            final String getRequestResponseBody = scan.useDelimiter("\\A").next();
                            final int responseCode = connection.getResponseCode();
                            JsonObject obj = new JsonObject();
                            obj.addProperty("code",responseCode);
                            obj.addProperty("message",connection.getResponseMessage());
                            obj.addProperty("data",getRequestResponseBody);

                            handler.requestCompleteCallback(new Gson().toJson(obj));
                        }
                        break;
                    default:
                        //throw new IllegalStateException("Invalid State '" + this.requestType + "'");
                        JsonObject obj = new JsonObject();
                        obj.addProperty("code",INTERNAL_REQUEST_ERROR);
                        obj.addProperty("message",String.format("Invalid State: '%s'",this.requestType));
                        obj.add("data",new JsonObject());

                        handler.requestCompleteCallback(new Gson().toJson(obj));
                }
            }catch (IOException ioe){
                InputStream connectionErrorStream = this.connection.getErrorStream();
                try(Scanner scan = new Scanner(connectionErrorStream)){
                    final String errorRequestResponseBody = scan.useDelimiter("\\A").next();
                    final int responseCode = connection.getResponseCode();
                    JsonObject obj = new JsonObject();
                    obj.addProperty("code",responseCode);
                    obj.addProperty("message",connection.getResponseMessage());
                    obj.addProperty("data",errorRequestResponseBody);

                    handler.requestCompleteCallback(new Gson().toJson(obj));
                } catch (IOException e) {
                    JsonObject obj = new JsonObject();
                    obj.addProperty("code",INTERNAL_REQUEST_ERROR + 1);
                    obj.addProperty("message","IO Exception: " + e.getMessage());
                    obj.add("data",new JsonObject());

                    handler.requestCompleteCallback(new Gson().toJson(obj));
                }
            }
        }
    }

    public void despose(){
        this.connection.disconnect();
    }

    public String getPath() {
        return path;
    }

    public String getHostname() {
        return hostname;
    }

    public boolean isHTTP() {
        return isHTTP;
    }

    private final void setRequestHeaders(final HttpURLConnection connection){
        String[] keys = this.headers.keySet().toArray(new String[0]);
        String[] vals = this.headers.values().toArray(new String[0]);
        if(keys.length == vals.length){
            for(int i = 0; i < keys.length; i++){
                connection.addRequestProperty(keys[i],vals[i]);
            }
        }else{
            throw new IllegalStateException("Header List is Corrupt.");
        }
    }

    public interface TheiaRequestHandler{
        public void requestCompleteCallback(String serializedData);
    }

    public static final String jsonToURLFormEncoding(String jsonString){
        String urlEncodedString = "";
        JsonObject obj = JsonParser.parseString(jsonString).getAsJsonObject();
        Set<Map.Entry<String, JsonElement>> entrySet = obj.entrySet();
        for(Map.Entry<String, JsonElement> entry : entrySet){
            urlEncodedString += entry.getKey() + "=" + entry.getValue() + "&";
        }
        return urlEncodedString.substring(0,urlEncodedString.length() - 1).replace("\"","");
    }
}