package com.themarqueeblink.co.success_notebook.plugin.statusbar

import android.app.Activity
import android.util.Log
import androidx.core.view.WindowCompat

class Example {
    fun pong(value: String): String {
        Log.i("Pong", value)
        return value
    }

    /**
     * Sets the status bar text and icons to a dark color.
     * This should be used on a light status bar background.
     *
     * @param activity The current Android activity.
     */
    fun setDarkStatusBar(activity: Activity) {
        val window = activity.window
        val insetsController = androidx.core.view.WindowCompat.getInsetsController(window, window.decorView)
        insetsController.isAppearanceLightStatusBars = true
    }

    /**
     * Sets the status bar text and icons to a light color.
     * This should be used on a dark status bar background.
     *
     * @param activity The current Android activity.
     */
    fun setLightStatusBar(activity: Activity) {
        val window = activity.window
        val insetsController = androidx.core.view.WindowCompat.getInsetsController(window, window.decorView)
        insetsController.isAppearanceLightStatusBars = false
    }
}
