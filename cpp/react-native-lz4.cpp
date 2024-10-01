#include "react-native-lz4.h"
#include "lz4.h"
#include "lz4file.h"
#include <stdio.h>
#include <string>
#include <iostream>
#include <fstream>
#include <vector>
#include <sys/stat.h>
#include <sys/types.h>
#include <cstring>
#include <cerrno>
#include <assert.h>
#include <stdlib.h>
#include <string.h>

using namespace facebook;

#define CHUNK_SIZE (16 * 1024)

struct FileOperationResult
{
    bool success;
    std::string message;
    size_t originalSize;
    size_t finalSize; // Can represent either compressed or decompressed size
};

static size_t get_file_size(FILE *file)
{
    if (file == nullptr)
    {
        return 0;
    }

    struct stat statbuf;
    int fd = fileno(file); // Get the file descriptor

    if (fstat(fd, &statbuf) != 0)
    {
        return 0; // Return 0 if the file size cannot be determined
    }

    return statbuf.st_size;
}

static int compress_file(FILE *f_in, FILE *f_out, std::function<void(size_t, size_t)> progressCallback)
{
    assert(f_in != NULL);
    assert(f_out != NULL);

    LZ4F_errorCode_t ret = LZ4F_OK_NoError;
    size_t len;
    LZ4_writeFile_t *lz4fWrite;
    void *const buf = malloc(CHUNK_SIZE);
    if (!buf)
    {
        printf("error: memory allocation failed \n");
        return 1;
    }

    size_t totalSize = get_file_size(f_in);
    size_t processedSize = 0;

    /* Of course, you can also use prefsPtr to
     * set the parameters of the compressed file
     * NULL is use default
     */
    ret = LZ4F_writeOpen(&lz4fWrite, f_out, NULL);
    if (LZ4F_isError(ret))
    {
        printf("LZ4F_writeOpen error: %s\n", LZ4F_getErrorName(ret));
        free(buf);
        return 1;
    }

    while (1)
    {
        len = fread(buf, 1, CHUNK_SIZE, f_in);

        if (ferror(f_in))
        {
            printf("fread error\n");
            goto out;
        }

        /* nothing to read */
        if (len == 0)
        {
            break;
        }

        ret = LZ4F_write(lz4fWrite, buf, len);
        if (LZ4F_isError(ret))
        {
            printf("LZ4F_write: %s\n", LZ4F_getErrorName(ret));
            goto out;
        }

        processedSize += len;
        if (progressCallback)
        {
            progressCallback(processedSize, totalSize);
        }
    }

out:
    free(buf);
    if (LZ4F_isError(LZ4F_writeClose(lz4fWrite)))
    {
        printf("LZ4F_writeClose: %s\n", LZ4F_getErrorName(ret));
        return 1;
    }

    return 0;
}

static int decompress_file(FILE *f_in, FILE *f_out, std::function<void(size_t, size_t)> progressCallback)
{
    assert(f_in != NULL);
    assert(f_out != NULL);

    LZ4F_errorCode_t ret = LZ4F_OK_NoError;
    LZ4_readFile_t *lz4fRead;
    void *const buf = malloc(CHUNK_SIZE);
    if (!buf)
    {
        printf("error: memory allocation failed \n");
    }

    size_t totalSize = get_file_size(f_in);
    size_t processedSize = 0;

    ret = LZ4F_readOpen(&lz4fRead, f_in);
    if (LZ4F_isError(ret))
    {
        printf("LZ4F_readOpen error: %s\n", LZ4F_getErrorName(ret));
        free(buf);
        return 1;
    }

    while (1)
    {
        ret = LZ4F_read(lz4fRead, buf, CHUNK_SIZE);
        if (LZ4F_isError(ret))
        {
            printf("LZ4F_read error: %s\n", LZ4F_getErrorName(ret));
            goto out;
        }

        /* nothing to read */
        if (ret == 0)
        {
            break;
        }

        if (fwrite(buf, 1, ret, f_out) != ret)
        {
            printf("write error!\n");
            goto out;
        }

        processedSize += ret;
        if (progressCallback)
        {
            progressCallback(processedSize, totalSize);
        }
    }

out:
    free(buf);
    if (LZ4F_isError(LZ4F_readClose(lz4fRead)))
    {
        printf("LZ4F_readClose: %s\n", LZ4F_getErrorName(ret));
        return 1;
    }

    if (ret)
    {
        return 1;
    }

    return 0;
}

// Helper function to create a jsi::Object from FileOperationResult
jsi::Object createJsResultObject(jsi::Runtime &runtime, const FileOperationResult &fileOperationResult)
{
    jsi::Object result = jsi::Object(runtime);
    result.setProperty(runtime, "success", jsi::Value(fileOperationResult.success));
    result.setProperty(runtime, "message", jsi::String::createFromUtf8(runtime, fileOperationResult.message));
    result.setProperty(runtime, "originalSize", jsi::Value(static_cast<double>(fileOperationResult.originalSize)));
    result.setProperty(runtime, "finalSize", jsi::Value(static_cast<double>(fileOperationResult.finalSize)));

    return result;
}

std::function<void(size_t, size_t)> createProgressCallback(jsi::Runtime &runtime, const jsi::Value *arguments, size_t count)
{
    if (count >= 3 && arguments[2].isObject() && arguments[2].asObject(runtime).isFunction(runtime))
    {
        auto jsCallback = std::make_shared<jsi::Function>(arguments[2].asObject(runtime).asFunction(runtime));

        return [jsCallback, &runtime](size_t processedSize, size_t totalSize)
        {
            jsi::Value arg1 = jsi::Value(static_cast<double>(processedSize));
            jsi::Value arg2 = jsi::Value(static_cast<double>(totalSize));

            jsCallback->call(runtime, arg1, arg2); // Call the JavaScript callback with processedSize and totalSize
        };
    }

    return nullptr; // Return nullptr if no valid callback is provided
}

namespace lz4
{
    int getLz4VersionNumber()
    {
        int version = LZ4_versionNumber();
        return version;
    }

    std::string getLz4VersionString()
    {
        const char *version = LZ4_versionString();
        return std::string(version);
    }

    FileOperationResult performFileOperation(
        const std::string &sourcePath,
        const std::string &destinationPath,
        const std::function<LZ4F_errorCode_t(FILE *, FILE *)> &operation)
    {
        const char *sourceFilePath = sourcePath.c_str();
        const char *destinationFilePath = destinationPath.c_str();

        FILE *inpFp = fopen(sourceFilePath, "rb");
        if (!inpFp)
        {
            return {false, "Failed to open source file", 0, 0};
        }

        FILE *outFp = fopen(destinationFilePath, "wb");
        if (!outFp)
        {
            fclose(inpFp);
            return {false, "Failed to open destination file", 0, 0};
        }

        LZ4F_errorCode_t ret = operation(inpFp, outFp);

        size_t originalSize = get_file_size(inpFp);
        size_t finalSize = get_file_size(outFp);

        fclose(inpFp);
        fclose(outFp);

        if (ret != 0)
        {
            return {false, LZ4F_getErrorName(ret), 0, 0};
        }

        return {true, "Operation completed", originalSize, finalSize};
    }

    FileOperationResult compressFile(const std::string &sourcePath, const std::string &destinationPath, std::function<void(size_t, size_t)> progressCallback = nullptr)
    {
        return performFileOperation(
            sourcePath, destinationPath,
            [progressCallback](FILE *f_in, FILE *f_out) -> LZ4F_errorCode_t
            {
                return compress_file(f_in, f_out, progressCallback);
            });
    }

    FileOperationResult decompressFile(const std::string &sourcePath, const std::string &destinationPath, std::function<void(size_t, size_t)> progressCallback = nullptr)
    {
        return performFileOperation(
            sourcePath, destinationPath,
            [progressCallback](FILE *f_in, FILE *f_out) -> LZ4F_errorCode_t
            {
                return decompress_file(f_in, f_out, progressCallback);
            });
    }

    // initializer function that exposes the LZ4 functions to JavaScript
    void initializeLz4(jsi::Runtime &runtime)
    {
        jsi::Object lz4 = jsi::Object(runtime);

        lz4.setProperty(runtime,
                        "getLz4VersionNumber",
                        jsi::Function::createFromHostFunction(
                            runtime,
                            jsi::PropNameID::forAscii(runtime, "getLz4VersionNumber"),
                            0, // number of arguments
                            [](jsi::Runtime &runtime,
                               const jsi::Value &thisValue,
                               const jsi::Value *arguments,
                               size_t count) -> jsi::Value
                            {
                                int version = lz4::getLz4VersionNumber();
                                return jsi::Value(version);
                            }));

        lz4.setProperty(runtime,
                        "getLz4VersionString",
                        jsi::Function::createFromHostFunction(
                            runtime,
                            jsi::PropNameID::forAscii(runtime, "getLz4VersionString"),
                            0, // number of arguments
                            [](jsi::Runtime &runtime,
                               const jsi::Value &thisValue,
                               const jsi::Value *arguments,
                               size_t count) -> jsi::Value
                            {
                                std::string version = lz4::getLz4VersionString();
                                return jsi::String::createFromUtf8(runtime, version);
                            }));

        lz4.setProperty(runtime,
                        "compressFile",
                        jsi::Function::createFromHostFunction(
                            runtime,
                            jsi::PropNameID::forAscii(runtime, "compressFile"),
                            2, // number of arguments
                            [](jsi::Runtime &runtime,
                               const jsi::Value &thisValue,
                               const jsi::Value *arguments,
                               size_t count) -> jsi::Value
                            {
                                if (count < 2 || !arguments[0].isString() || !arguments[1].isString())
                                {
                                    throw jsi::JSError(runtime, "compressFile() requires two string arguments");
                                }

                                std::string sourcePath = arguments[0].getString(runtime).utf8(runtime);
                                std::string destinationPath = arguments[1].getString(runtime).utf8(runtime);
                                std::function<void(size_t, size_t)> progressCallback = createProgressCallback(runtime, arguments, count);

                                FileOperationResult fileOperationResult = lz4::compressFile(sourcePath, destinationPath, progressCallback);

                                return createJsResultObject(runtime, fileOperationResult);
                            }));

        lz4.setProperty(runtime,
                        "decompressFile",
                        jsi::Function::createFromHostFunction(
                            runtime,
                            jsi::PropNameID::forAscii(runtime, "decompressFile"),
                            2, // number of arguments
                            [](jsi::Runtime &runtime,
                               const jsi::Value &thisValue,
                               const jsi::Value *arguments,
                               size_t count) -> jsi::Value
                            {
                                if (count < 2 || !arguments[0].isString() || !arguments[1].isString())
                                {
                                    throw jsi::JSError(runtime, "decompressFile() requires two string arguments");
                                }

                                std::string sourcePath = arguments[0].getString(runtime).utf8(runtime);
                                std::string destinationPath = arguments[1].getString(runtime).utf8(runtime);
                                std::function<void(size_t, size_t)> progressCallback = createProgressCallback(runtime, arguments, count);

                                FileOperationResult fileOperationResult = lz4::decompressFile(sourcePath, destinationPath, progressCallback);

                                return createJsResultObject(runtime, fileOperationResult);
                            }));

        // Expose the lz4 object globally
        runtime.global().setProperty(runtime, "lz4", std::move(lz4));

        printf("LZ4 module initialized\n");
    }
}
