#include "react-native-lz4.h"
#include "lz4.h"
#include <stdio.h>
#include <string>
#include <iostream>
#include <fstream>
#include <vector>
#include <sys/stat.h>
#include <sys/types.h>
#include <cstring>
#include <cerrno>

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

// Function to create all parent directories
void ensureDirectoriesExist(const std::string &filePath)
{
	size_t pos = filePath.find_last_of('/');
	if (pos != std::string::npos)
	{
		std::string directoryPath = filePath.substr(0, pos);
		if (!createDirectory(directoryPath))
		{
			std::cerr << "Error ensuring directory path exists: " << directoryPath << std::endl;
		}
	}
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
		printf("Compressing file %s to %s\n", sourcePath.c_str(), destinationPath.c_str());

		// Open the input file
		std::ifstream inputFile(sourcePath, std::ios::binary);
		if (!inputFile.is_open())
		{
			std::cerr << "Error opening input file: " << sourcePath << std::endl;
			return false;
		}

		// Read file into buffer
		inputFile.seekg(0, std::ios::end);
		size_t inputSize = inputFile.tellg();
		inputFile.seekg(0, std::ios::beg);

		std::vector<char> inputBuffer(inputSize);
		inputFile.read(inputBuffer.data(), inputSize);
		inputFile.close();

		// Allocate buffer for compressed data
		int maxCompressedSize = LZ4_compressBound(inputSize);
		std::vector<char> compressedBuffer(maxCompressedSize);

		printf("Compressing %lu bytes to %d bytes\n", inputSize, maxCompressedSize);

		// Compress the data
		int compressedSize = LZ4_compress_default(
			inputBuffer.data(),		 // Source
			compressedBuffer.data(), // Destination
			inputSize,				 // Input size
			maxCompressedSize		 // Max compressed size
		);

		if (compressedSize <= 0)
		{
			std::cerr << "Compression failed." << std::endl;
			return false;
		}

		// Ensure the destination directory exists – @TODO: maybe this is not necessary. Double check when testing more the uncompressed file.
		ensureDirectoriesExist(destinationPath);

		// Open the output file to save the compressed data
		std::ofstream outputFile(destinationPath, std::ios::binary);
		if (!outputFile.is_open())
		{
			std::cerr << "Error opening output file: " << destinationPath << std::endl;
			std::cerr << "Error: " << strerror(errno) << std::endl;
			return false;
		}

		// Write the compressed data
		outputFile.write(compressedBuffer.data(), compressedSize);
		outputFile.close();

		std::cout << "File compressed successfully: " << destinationPath << std::endl;

		return true;
	}

	bool decompressFile(const std::string &sourcePath, const std::string &destinationPath)
	{
		printf("Decompressing file %s to %s\n", sourcePath.c_str(), destinationPath.c_str());

		// Open the input file
		std::ifstream inputFile(sourcePath, std::ios::binary);
		if (!inputFile.is_open())
		{
			std::cerr << "Error opening input file: " << sourcePath << std::endl;
			return false;
		}

		// Read file into buffer
		inputFile.seekg(0, std::ios::end);
		size_t compressedSize = inputFile.tellg();
		inputFile.seekg(0, std::ios::beg);

		std::vector<char> compressedBuffer(compressedSize);
		inputFile.read(compressedBuffer.data(), compressedSize);
		inputFile.close();

		// Allocate buffer for decompressed data
		int maxDecompressedSize = 1024 * 1024 * 1024; // 1 GB
		std::vector<char> decompressedBuffer(maxDecompressedSize);

		printf("Decompressing %lu bytes to %d bytes\n", compressedSize, maxDecompressedSize);

		// Decompress the data
		int decompressedSize = LZ4_decompress_safe(
			compressedBuffer.data(),   // Source
			decompressedBuffer.data(), // Destination
			compressedSize,			   // Compressed size
			maxDecompressedSize		   // Max decompressed size
		);

		if (decompressedSize <= 0)
		{
			std::cerr << "Decompression failed." << std::endl;
			return false;
		}

		// Ensure the destination directory exists – @TODO: maybe this is not necessary.
		ensureDirectoriesExist(destinationPath);

		// Open the output file to save the decompressed data
		std::ofstream outputFile(destinationPath, std::ios::binary);
		if (!outputFile.is_open())
		{
			std::cerr << "Error opening output file: " << destinationPath << std::endl;
			std::cerr << "Error: " << strerror(errno) << std::endl;
			return false;
		}

		// Write the decompressed data
		outputFile.write(decompressedBuffer.data(), decompressedSize);
		outputFile.close();

		std::cout << "File decompressed successfully: " << destinationPath << std::endl;

		return true;
	}
}
