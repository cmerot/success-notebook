package com.themarqueeblink.co.success_notebook

import android.annotation.SuppressLint
import android.util.Log
import android.content.res.Configuration
import android.os.Bundle
import androidx.activity.enableEdgeToEdge
import androidx.core.view.WindowCompat

class MainActivity : TauriActivity() {
  override fun onCreate(savedInstanceState: Bundle?) {
    enableEdgeToEdge()
    super.onCreate(savedInstanceState)
  }

  // @SuppressLint("SourceLockedOrientationActivity")
  // override fun onConfigurationChanged(newConfig: Configuration) {
  //   super.onConfigurationChanged(newConfig)
  //   WindowCompat.getInsetsController(window, window.decorView).isAppearanceLightStatusBars =
  //     (newConfig.uiMode and Configuration.UI_MODE_NIGHT_MASK) != Configuration.UI_MODE_NIGHT_YES
  // }
}
