package com.themarqueeblink.co.success_notebook.plugin.statusbar

import android.app.Activity
import app.tauri.annotation.Command
import app.tauri.annotation.InvokeArg
import app.tauri.annotation.TauriPlugin
import app.tauri.plugin.JSObject
import app.tauri.plugin.Plugin
import app.tauri.plugin.Invoke

@InvokeArg
class PingArgs {
  var value: String? = null
}

@TauriPlugin
class ExamplePlugin(private val activity: Activity): Plugin(activity) {
    private val implementation = Example()

    @Command
    fun ping(invoke: Invoke) {
        val args = invoke.parseArgs(PingArgs::class.java)

        val ret = JSObject()
        ret.put("value", implementation.pong(args.value ?: "default value :("))
        invoke.resolve(ret)
    }

    // New command to set status bar text/icons to a dark color
    @Command
    fun setDark(invoke: Invoke) {
        // Run the UI update on the main thread
        activity.runOnUiThread {
            implementation.setDarkStatusBar(activity)
            // Signal to the frontend that the command succeeded
            val ret = JSObject()
            ret.put("res", "dark ok")
            invoke.resolve(ret)
        }
    }

    // New command to set status bar text/icons to a light color
    @Command
    fun setLight(invoke: Invoke) {
        // Run the UI update on the main thread
        activity.runOnUiThread {
            implementation.setLightStatusBar(activity)
            // Signal to the frontend that the command succeeded
            val ret = JSObject()
            ret.put("res", "light ok")
            invoke.resolve(ret)
        }
    }
}
