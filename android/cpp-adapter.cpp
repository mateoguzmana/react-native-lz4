#include <jni.h>
#include "react-native-lz4.h"

extern "C"
JNIEXPORT jdouble JNICALL
Java_com_lz4_Lz4Module_nativeMultiply(JNIEnv *env, jclass type, jdouble a, jdouble b) {
    return lz4::multiply(a, b);
}

extern "C"
JNIEXPORT jint JNICALL
Java_com_lz4_Lz4Module_nativeGetLz4VersionNumber(JNIEnv *env, jclass type) {
    return lz4::getLz4VersionNumber();
}

extern "C"
JNIEXPORT jstring JNICALL
Java_com_lz4_Lz4Module_nativeGetLz4VersionString(JNIEnv *env, jclass type) {
    std::string version = lz4::getLz4VersionString();
    return env->NewStringUTF(version.c_str());
}
