#include <jni.h>
#include "react-native-lz4.h"

extern "C"
JNIEXPORT jdouble JNICALL
Java_com_lz4_Lz4Module_nativeMultiply(JNIEnv *env, jclass type, jdouble a, jdouble b) {
    return lz4::multiply(a, b);
}
