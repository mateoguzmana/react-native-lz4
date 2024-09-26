package com.lz4

import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.Promise

class Lz4Module internal constructor(context: ReactApplicationContext) :
  Lz4Spec(context) {

  override fun getName(): String {
    return NAME
  }

  @ReactMethod
  override fun getLz4VersionNumber(promise: Promise) {
    promise.resolve(nativeGetLz4VersionNumber())
  }

  @ReactMethod
  override fun getLz4VersionString(promise: Promise) {
    promise.resolve(nativeGetLz4VersionString())
  }

  @ReactMethod
  override fun compressFile(sourcePath: String, destinationPath: String, promise: Promise) {
    promise.resolve(nativeCompressFile(sourcePath, destinationPath))
  }

  @ReactMethod
  override fun decompressFile(sourcePath: String, destinationPath: String, promise: Promise) {
    promise.resolve(nativeDecompressFile(sourcePath, destinationPath))
  }

  companion object {
    const val NAME = "Lz4"
  }

  init {
    System.loadLibrary("react-native-lz4")
  }

  external fun nativeGetLz4VersionNumber(): Int
  external fun nativeGetLz4VersionString(): String
  external fun nativeCompressFile(sourcePath: String, destinationPath: String): Boolean
  external fun nativeDecompressFile(sourcePath: String, destinationPath: String): Boolean
}
