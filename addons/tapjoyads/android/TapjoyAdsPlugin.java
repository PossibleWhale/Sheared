package com.tealeaf.plugin.plugins;
import java.util.Map;
import org.json.JSONObject;
import org.json.JSONArray;
import org.json.JSONException;
import android.support.v4.app.Fragment;
import android.support.v4.app.FragmentActivity;
import com.tealeaf.EventQueue;
import com.tealeaf.TeaLeaf;
import com.tealeaf.logger;
import com.tealeaf.event.PluginEvent;
import android.content.pm.PackageManager;
import android.content.pm.ApplicationInfo;
import android.os.Bundle;
import java.util.HashMap;

import com.tealeaf.plugin.IPlugin;
import android.app.Activity;
import android.app.AlertDialog;
import android.app.AlertDialog.Builder;
import android.content.Intent;
import android.content.Context;
import android.content.DialogInterface;
import android.util.Log;

import com.tealeaf.EventQueue;
import com.tealeaf.event.*;

import com.tapjoy.TapjoyConnect;
import com.tapjoy.TapjoyConstants;
import com.tapjoy.TapjoyLog;
import com.tapjoy.TapjoyFullScreenAdNotifier;

public class TapjoyAdsPlugin implements IPlugin, TapjoyFullScreenAdNotifier {
    Context _ctx;
    HashMap<String, String> manifestKeyMap = new HashMap<String,String>();

    public TapjoyAdsPlugin() {
    }

    public class TapjoyadsEvent extends com.tealeaf.event.Event {
        boolean success;
        String message;
        int errorCode;

        public TapjoyadsEvent(String s) {
            super("tapjoyads");
            this.message = s;
        }

        public TapjoyadsEvent(String s, int ec) {
            super("tapjoyads");
            this.message = s;
            this.errorCode = ec;
            logger.log("[ANDROID PLUGIN] Tapjoy event failed: message='" + s + "' code=" + ec);
        }
    }

    public void onCreateApplication(Context applicationContext) {
        _ctx = applicationContext;
    }

    public void onCreate(Activity activity, Bundle savedInstanceState) {
        PackageManager manager = activity.getBaseContext().getPackageManager();
        String[] keys = {"tapjoyAppID", "tapjoySecretKey"};
        try {
            Bundle meta = manager.getApplicationInfo(activity.getApplicationContext().getPackageName(),
                    PackageManager.GET_META_DATA).metaData;
            for (String k : keys) {
                if (meta.containsKey(k)) {
                    manifestKeyMap.put(k, meta.get(k).toString());
                }
            }
        } catch (Exception e) {
            logger.log("Exception while loading manifest keys:", e);
        }

        String tapjoyAppID = manifestKeyMap.get("tapjoyAppID");
        String tapjoySecretKey = manifestKeyMap.get("tapjoySecretKey");

        logger.log("{tapjoy} Installing for appID:", tapjoyAppID);

        // Enables logging to the console.
        TapjoyLog.enableLogging(true);

        // Connect with the Tapjoy server.
        TapjoyConnect.requestTapjoyConnect(_ctx, tapjoyAppID, tapjoySecretKey);
    }

    /*
     * From javascript call 
     *     NATIVE.plugins.sendEvent("TapjoyAds", "requestAd", "")
     *
     * This will start the ad request process. Then, somewhere in your code,
     * call:
     *
     *     NATIVE.events.registerHandler("tapjoyads", function (evt) { ... });
     *
     * This event will fire when the requested ad arrives and just before it is displayed.
     */
    public void requestAd(String _) {
        logger.log("requesting ad");
        String tapjoyCurrencyID = manifestKeyMap.get("tapjoyCurrencyID");
        TapjoyConnect.getTapjoyConnectInstance().getFullScreenAdWithCurrencyID(tapjoyCurrencyID, this);
    }

    // Notifier when a TapjoyConnect.getFullScreenAd is successful.
    public void getFullScreenAdResponse() 
    {
        EventQueue.pushEvent(new TapjoyadsEvent("getFullScreenAdResponse (success)"));
        TapjoyConnect.getTapjoyConnectInstance().showFullScreenAd();
    }

    // Notifier when a TapjoyConnect.getFullScreenAd is unsuccessful :(
    public void getFullScreenAdResponseFailed(int e) 
    {
        EventQueue.pushEvent(new TapjoyadsEvent("getFullScreenAdResponseFailed (failed)", e));
    }

    public void onResume() {
    }

    public void onStart() {
    }

    public void onPause() {
    }

    public void onStop() {
    }

    public void onDestroy() {
    }

    public void onNewIntent(Intent intent) {
    }

    public void setInstallReferrer(String referrer) {
    }

    public void onActivityResult(Integer request, Integer result, Intent data) {
    }

    public void logError(String error) {
    }

    public boolean consumeOnBackPressed() {
        return true;
    }

    public void onBackPressed() {
    }
}

