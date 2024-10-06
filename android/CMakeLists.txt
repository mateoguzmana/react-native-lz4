cmake_minimum_required(VERSION 3.4.1)
project(Lz4)

set (CMAKE_VERBOSE_MAKEFILE ON)
set (CMAKE_CXX_STANDARD 14)

file(TO_CMAKE_PATH "${NODE_MODULES_DIR}/react-native/ReactCommon/jsi/jsi/jsi.cpp" libPath)

add_library(react-native-lz4            SHARED
            ${libPath}
            ../cpp/react-native-lz4.cpp
            ../cpp/external/lz4.h
            ../cpp/external/lz4.c
            ../cpp/external/lz4hc.h
            ../cpp/external/lz4hc.c
            ../cpp/external/lz4frame.h
            ../cpp/external/lz4frame.c
            ../cpp/external/lz4frame_static.h
            ../cpp/external/lz4file.h
            ../cpp/external/lz4file.c
            ../cpp/external/xxhash.h
            ../cpp/external/xxhash.c
            cpp-adapter.cpp
)

# Specifies a path to native header files.
include_directories(
            ../cpp
            "${NODE_MODULES_DIR}/react-native/React"
            "${NODE_MODULES_DIR}/react-native/React/Base"
            "${NODE_MODULES_DIR}/react-native/ReactCommon/jsi"
)
