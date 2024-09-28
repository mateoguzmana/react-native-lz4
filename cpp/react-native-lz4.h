#ifndef LZ4_H
#define LZ4_H

#include <string>
#include <jsi/jsi.h>

namespace lz4
{
  int getLz4VersionNumber();
  std::string getLz4VersionString();
  bool compressFile(const std::string &sourcePath, const std::string &destinationPath);
  bool decompressFile(const std::string &sourcePath, const std::string &destinationPath);
  void initializeLz4(facebook::jsi::Runtime &runtime);
}

#endif /* LZ4_H */
