package com.schednotesv3.backgroundtask;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.os.Build;
import android.widget.Toast;

public class BackgroundAlarmManager extends BroadcastReceiver {
    @Override
    public void onReceive(Context context, Intent intent) {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            //log("Starting the service in >=26 Mode from a BroadcastReceiver")
            context.startForegroundService(new Intent(context, BackgroundService.class));
            return;
        }else{
            context.startService(new Intent(context, BackgroundService.class));
        }
        //log("Starting the service in < 26 Mode from a BroadcastReceiver")


    }
}
