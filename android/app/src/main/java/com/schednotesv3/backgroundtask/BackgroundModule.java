package com.schednotesv3.backgroundtask;

import android.content.Context;
import android.app.AlarmManager;
import android.app.PendingIntent;
import android.content.Intent;
import android.os.SystemClock;
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
        startAlert();
    }
    @ReactMethod
    public void stopService(){
        this.reactContext.stopService(new Intent(this.reactContext, BackgroundService.class));

    }
    public void startAlert(){
//        Intent intent = new Intent(this.reactContext, BackgroundAlarmManager.class);
//        PendingIntent pendingIntent = PendingIntent.getBroadcast(
//                this.reactContext, 234324243, intent, 0);
//        AlarmManager alarmManager = (AlarmManager) this.reactContext.getSystemService(Context.ALARM_SERVICE);
////        alarmManager.set(AlarmManager.RTC_WAKEUP, System.currentTimeMillis() + (2*60*1000), pendingIntent);
////        alarmManager.setRepeating(AlarmManager.ELAPSED_REALTIME_WAKEUP, SystemClock.elapsedRealtime(), 2*60*1000,                pendingIntent);
//        alarmManager.setRepeating(AlarmManager.RTC_WAKEUP, System.currentTimeMillis(), 1*60*1000, pendingIntent);


        AlarmManager alarmMgr = (AlarmManager)this.reactContext.getSystemService(Context.ALARM_SERVICE);
        Intent intent = new Intent(this.reactContext, BackgroundAlarmManager.class);
        PendingIntent pendingIntent = PendingIntent.getBroadcast(this.reactContext, 0,  intent, PendingIntent.FLAG_IMMUTABLE);
        alarmMgr.setRepeating(AlarmManager.RTC_WAKEUP, System.currentTimeMillis(),10*60*1000, pendingIntent);
        Toast.makeText(this.reactContext.getApplicationContext(), "SchedNotes still working hard..", Toast.LENGTH_SHORT).show();
    }
}
