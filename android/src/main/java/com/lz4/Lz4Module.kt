package com.lz4

import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.Promise

class Lz4Module internal constructor(context: ReactApplicationContext) :
  Lz4Spec(context) {

  override fun getName(): String {
    return NAME
  }

  // Example method
  // See https://reactnative.dev/docs/native-modules-android
  @ReactMethod
  override fun multiply(a: Double, b: Double, promise: Promise) {
    promise.resolve(a * b)
  }

  @ReactMethod
  override fun getLz4VersionNumber(promise: Promise) {
    promise.resolve(nativeGetLz4VersionNumber())
  }

  companion object {
    const val NAME = "Lz4"
  }

  init {
    System.loadLibrary("react-native-lz4")
  }

  external fun nativeGetLz4VersionNumber(): Int
}
