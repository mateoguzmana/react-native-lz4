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

static size_t get_file_size(char *filename)
{
    struct stat statbuf;

    if (filename == NULL)
    {
        return 0;
    }

    if (stat(filename, &statbuf))
    {
        return 0;
    }

    return statbuf.st_size;
}

static int compress_file(FILE *f_in, FILE *f_out)
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

static int decompress_file(FILE *f_in, FILE *f_out)
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

// Function to create a directory
bool createDirectory(const std::string &path)
{
    struct stat info;
    if (stat(path.c_str(), &info) != 0)
    {
        // Try to create the directory
        if (mkdir(path.c_str(), 0777) != 0)
        {
            std::cerr << "Error creating directory: " << path << std::endl;
            std::cerr << "Error code: " << errno << " (" << strerror(errno) << ")" << std::endl;
            return false;
        }
    }
    return true;
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

    bool compressFile(const std::string &sourcePath, const std::string &destinationPath)
    {
        // Get const char* from the strings (for places that expect const char*)
        const char *sourcePathCStr = sourcePath.c_str();
        const char *destinationPathCStr = destinationPath.c_str();

        char *sourcePathMutable = strdup(sourcePathCStr);           // Create mutable char* from const char*
        char *destinationPathMutable = strdup(destinationPathCStr); // Create mutable char* from const char*

        FILE *const inpFp = fopen(sourcePathCStr, "rb");
        FILE *const outFp = fopen(destinationPathCStr, "wb");

        printf("compress : %s -> %s\n", sourcePathCStr, destinationPathCStr);

        LZ4F_errorCode_t ret = compress_file(inpFp, outFp);

        fclose(inpFp);
        fclose(outFp);

        if (ret)
        {
            printf("compression error: %s\n", LZ4F_getErrorName(ret));

            return false;
        }

        printf("%s: %zu → %zu bytes, %.1f%%\n",
               sourcePathMutable,
               get_file_size(sourcePathMutable),
               get_file_size(destinationPathMutable), /* might overflow is size_t is 32 bits and size_{in,out} > 4 GB */
               (double)get_file_size(destinationPathMutable) / get_file_size(sourcePathMutable) * 100);

        printf("compress : done\n");

        return true;
    }

    bool decompressFile(const std::string &sourcePath, const std::string &destinationPath)
    {
        // Get const char* from the strings (for places that expect const char*)
        const char *sourcePathCStr = sourcePath.c_str();
        const char *destinationPathCStr = destinationPath.c_str();

        FILE *const inpFp = fopen(sourcePathCStr, "rb");
        FILE *const outFp = fopen(destinationPathCStr, "wb");

        printf("decompress : %s -> %s\n", sourcePathCStr, destinationPathCStr);
        LZ4F_errorCode_t ret = decompress_file(inpFp, outFp);

        fclose(outFp);
        fclose(inpFp);

        if (ret)
        {
            printf("compression error: %s\n", LZ4F_getErrorName(ret));
            return 1;
        }

        printf("decompress : done\n");

        return true;
    }

    void initializeLz4(jsi::Runtime &runtime)
    {
        // Create a JavaScript object to represent the lz4 module
        jsi::Object lz4 = jsi::Object(runtime);

        // Add the LZ4 version number function
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
                                printf("LZ4 version number: %d\n", version);
                                return jsi::Value(version); // Return the version number as a JS number
                            }));

        // Expose the lz4 object globally
        runtime.global().setProperty(runtime, "lz4", std::move(lz4));

        printf("LZ4 module initialized\n");
    }
}
