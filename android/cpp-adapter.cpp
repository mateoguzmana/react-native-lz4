#include <jni.h>
#include "react-native-lz4.h"

extern "C" JNIEXPORT void JNICALL
Java_com_lz4_Lz4Module_nativeInitializeLz4(JNIEnv *env, jclass clazz, jlong jsiPtr)
{
    lz4::initializeLz4(*reinterpret_cast<facebook::jsi::Runtime *>(jsiPtr));
}
