#ifndef LZ4_H
#define LZ4_H

#include <string>

namespace lz4
{
  double multiply(double a, double b);
  int getLz4VersionNumber();
  std::string getLz4VersionString();
  bool compressFile(const std::string &sourcePath, const std::string &destinationPath);
  bool decompressFile(const std::string &sourcePath, const std::string &destinationPath);
}

#endif /* LZ4_H */
