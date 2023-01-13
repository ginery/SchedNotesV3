package com.schednotesv3.backgroundtask;

import android.app.Notification;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.app.Service;
import android.content.ComponentName;
import android.content.Context;
import android.content.Intent;
import android.net.Uri;
import android.os.Build;
import android.os.Environment;
import android.os.Handler;
import android.os.IBinder;
import android.provider.Settings;
import android.widget.Toast;

import androidx.core.app.NotificationCompat;

import com.facebook.react.HeadlessJsTaskService;
import com.schednotesv3.MainActivity;
import com.schednotesv3.R;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.util.Properties;

public class BackgroundService extends Service {
    private static final int SERVICE_NOTIFICATION_ID = 20220302;
    private static final String CHANNEL_ID = "BACKGROUND_ID";
    private Handler handler = new Handler();
    private Runnable runnableCode = new Runnable() {
        @Override
        public void run() {
            Context context = getApplicationContext();
            Intent myIntent = new Intent(context, BackgroundEventService.class);
            context.startService(myIntent);
            HeadlessJsTaskService.acquireWakeLockNow(context);
            handler.postDelayed(this, 600000); // 10min interval for headless task in react


            
        }
    };
    private void createNotificationChannel() {
        // Create the NotificationChannel, but only on API 26+ because
        // the NotificationChannel class is new and not in the support library
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            int importance = NotificationManager.IMPORTANCE_DEFAULT;
            NotificationChannel channel = new NotificationChannel(CHANNEL_ID, "BACKGROUND_ID", importance);
            channel.setDescription("BACKGROUND DESCRIPTION");
            NotificationManager notificationManager = getSystemService(NotificationManager.class);
            notificationManager.createNotificationChannel(channel);
        }
    }
    @Override
    public IBinder onBind(Intent intent) {
        return null;
    }
    @Override
    public void onCreate() {
        super.onCreate();

    }
    @Override
    public void onDestroy() {
        super.onDestroy();
        this.handler.removeCallbacks(this.runnableCode);
    }
    @Override
    public int onStartCommand(Intent intent, int flags, int startId) {
//        sya ni ang ga run background nga daw notifcation
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            this.handler.post(this.runnableCode);
            createNotificationChannel();
            Intent notificationIntent = new Intent(this, MainActivity.class);
            PendingIntent contentIntent = PendingIntent.getActivity(this, 0, notificationIntent, PendingIntent.FLAG_IMMUTABLE);
            Notification notification = new NotificationCompat.Builder(this, CHANNEL_ID)
                    .setContentTitle("SchedNotes")
                    .setContentText("Working...")
                    .setSmallIcon(R.mipmap.sched_icon_round)
                    .setContentIntent(contentIntent)
                    .setOngoing(true)
                    .build();
            startForeground(SERVICE_NOTIFICATION_ID, notification);
        }else{
            this.handler.post(this.runnableCode);
            createNotificationChannel();
            Intent notificationIntent = new Intent(this, MainActivity.class);
            PendingIntent contentIntent = PendingIntent.getActivity(this, 0, notificationIntent, PendingIntent.FLAG_CANCEL_CURRENT);
            Notification notification = new NotificationCompat.Builder(this, CHANNEL_ID)
                    .setContentTitle("SchedNotes")
                    .setContentText("Working...")
                    .setSmallIcon(R.mipmap.sched_icon_round)
                    .setContentIntent(contentIntent)
                    .setOngoing(true)
                    .build();
            startForeground(SERVICE_NOTIFICATION_ID, notification);
        }

//        onDisplayPopupPermission();

        return START_STICKY;
    }
//    private void onDisplayPopupPermission() {
//        Toast.makeText(getApplicationContext(), "test PopUp", Toast.LENGTH_SHORT).show();
//        Intent intent = new Intent();
//        intent.setComponent(new ComponentName("com.miui.securitycenter", "com.miui.permcenter.autostart.AutoStartManagementActivity"));
//        startActivity(intent);
////        if(Build.BRAND.equalsIgnoreCase("xiaomi") ){
////
////            Intent intent = new Intent();
////            intent.setComponent(new ComponentName("com.miui.securitycenter", "com.miui.permcenter.autostart.AutoStartManagementActivity"));
////            startActivity(intent);
////
////
////        }else if(Build.BRAND.equalsIgnoreCase("Letv")){
////
////            Intent intent = new Intent();
////            intent.setComponent(new ComponentName("com.letv.android.letvsafe", "com.letv.android.letvsafe.AutobootManageActivity"));
////            startActivity(intent);
////
////        }
////        else if(Build.BRAND.equalsIgnoreCase("Honor")){
////
////            Intent intent = new Intent();
////            intent.setComponent(new ComponentName("com.huawei.systemmanager", "com.huawei.systemmanager.optimize.process.ProtectActivity"));
////            startActivity(intent);
////
////        }
//    }


}
