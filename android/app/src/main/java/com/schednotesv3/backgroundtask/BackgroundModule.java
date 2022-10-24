package com.schednotesv3.backgroundtask;

import android.content.Intent;
import android.widget.Toast;

import androidx.annotation.NonNull;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

public class BackgroundModule extends ReactContextBaseJavaModule {
    public static final String REACT_CLASS = "Background";
    private static ReactApplicationContext reactContext;

    public BackgroundModule(@NonNull ReactApplicationContext reactContext){
        super(reactContext);
        this.reactContext = reactContext;
    }
    @NonNull
    @Override
    public String getName() {
        return REACT_CLASS;
    }
    @ReactMethod
    public void startService(){
        this.reactContext.startService(new Intent(this.reactContext, BackgroundService.class));
        Toast.makeText(reactContext, "SchedNotes at work", Toast.LENGTH_SHORT).show();
    }
    @ReactMethod
    public void stopService(){
        this.reactContext.stopService(new Intent(this.reactContext, BackgroundService.class));
    }
}
