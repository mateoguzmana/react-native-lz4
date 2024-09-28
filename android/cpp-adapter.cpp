#include <jni.h>
#include "react-native-lz4.h"

extern "C" JNIEXPORT jint JNICALL
Java_com_lz4_Lz4Module_nativeGetLz4VersionNumber(JNIEnv *env, jclass type)
{
    return lz4::getLz4VersionNumber();
}

extern "C" JNIEXPORT jstring JNICALL
Java_com_lz4_Lz4Module_nativeGetLz4VersionString(JNIEnv *env, jclass type)
{
    std::string version = lz4::getLz4VersionString();
    return env->NewStringUTF(version.c_str());
}

extern "C" JNIEXPORT jboolean JNICALL
Java_com_lz4_Lz4Module_nativeCompressFile(JNIEnv *env, jclass type, jstring sourcePath, jstring destinationPath)
{
    const char *sourcePathChars = env->GetStringUTFChars(sourcePath, 0);
    const char *destinationPathChars = env->GetStringUTFChars(destinationPath, 0);
    std::string sourcePathString = std::string(sourcePathChars);
    std::string destinationPathString = std::string(destinationPathChars);
    env->ReleaseStringUTFChars(sourcePath, sourcePathChars);
    env->ReleaseStringUTFChars(destinationPath, destinationPathChars);
    return lz4::compressFile(sourcePathString, destinationPathString);
}

extern "C" JNIEXPORT jboolean JNICALL
Java_com_lz4_Lz4Module_nativeDecompressFile(JNIEnv *env, jclass type, jstring sourcePath, jstring destinationPath)
{
    const char *sourcePathChars = env->GetStringUTFChars(sourcePath, 0);
    const char *destinationPathChars = env->GetStringUTFChars(destinationPath, 0);
    std::string sourcePathString = std::string(sourcePathChars);
    std::string destinationPathString = std::string(destinationPathChars);
    env->ReleaseStringUTFChars(sourcePath, sourcePathChars);
    env->ReleaseStringUTFChars(destinationPath, destinationPathChars);
    return lz4::decompressFile(sourcePathString, destinationPathString);
}

extern "C" JNIEXPORT void JNICALL
Java_com_lz4_Lz4Module_nativeInitializeLz4(JNIEnv *env, jclass clazz, jlong jsiPtr)
{
    lz4::initializeLz4(*reinterpret_cast<facebook::jsi::Runtime *>(jsiPtr));
}
