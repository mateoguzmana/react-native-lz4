cmake_minimum_required(VERSION 3.4.1)
project(Lz4)

set (CMAKE_VERBOSE_MAKEFILE ON)
set (CMAKE_CXX_STANDARD 14)

file(TO_CMAKE_PATH "${NODE_MODULES_DIR}/react-native/ReactCommon/jsi/jsi/jsi.cpp" libPath)

add_library(react-native-lz4            SHARED
            ${libPath}
            ../cpp/react-native-lz4.cpp
            ../cpp/lz4.h
            ../cpp/lz4.c
            ../cpp/lz4hc.h
            ../cpp/lz4hc.c
            ../cpp/lz4frame.h
            ../cpp/lz4frame.c
            ../cpp/lz4frame_static.h
            ../cpp/lz4file.h
            ../cpp/lz4file.c
            ../cpp/xxhash.h
            ../cpp/xxhash.c
            cpp-adapter.cpp
)

# Specifies a path to native header files.
include_directories(
            ../cpp
            "${NODE_MODULES_DIR}/react-native/React"
            "${NODE_MODULES_DIR}/react-native/React/Base"
            "${NODE_MODULES_DIR}/react-native/ReactCommon/jsi"
)
