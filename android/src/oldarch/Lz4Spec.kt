package com.lz4

import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.Promise

abstract class Lz4Spec internal constructor(context: ReactApplicationContext) :
  ReactContextBaseJavaModule(context) {

  abstract fun getLz4VersionNumber(promise: Promise)
  abstract fun getLz4VersionString(promise: Promise)
  abstract fun compressFile(sourcePath: String, destinationPath: String, promise: Promise)
  abstract fun decompressFile(sourcePath: String, destinationPath: String, promise: Promise)
}
