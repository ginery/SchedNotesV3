package com.schednotesv3.backgroundtask;

import android.content.Context;
import android.app.AlarmManager;
import android.app.PendingIntent;
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
        startAlert();
    }
    public void startAlert(){
        Intent intent = new Intent(this.reactContext, BackgroundAlarmManager.class);
        PendingIntent pendingIntent = PendingIntent.getBroadcast(
                this.reactContext, 234324243, intent, 0);
        AlarmManager alarmManager = (AlarmManager) this.reactContext.getSystemService(Context.ALARM_SERVICE);
        alarmManager.set(AlarmManager.RTC_WAKEUP, System.currentTimeMillis() + (300+1000), pendingIntent);
    }
}
