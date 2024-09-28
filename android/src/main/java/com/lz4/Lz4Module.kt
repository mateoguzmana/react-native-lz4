package com.lz4

import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.Promise

class Lz4Module internal constructor(context: ReactApplicationContext) :
  Lz4Spec(context) {

  override fun getName(): String {
    return NAME
  }

  @ReactMethod(isBlockingSynchronousMethod = true)
  override fun initializeLz4() {
    val jsContext = getReactApplicationContext().getJavaScriptContextHolder()

    if (jsContext === null || jsContext.get() == 0L) {
        println("Failed to initialize Lz4: JavaScriptContextHolder is null or zero")
        return
      }

    nativeInitializeLz4(jsContext.get())
  }

  companion object {
    const val NAME = "Lz4"
  }

  init {
    System.loadLibrary("react-native-lz4")
  }

  external fun nativeInitializeLz4(jsiPtr: Long)
}
