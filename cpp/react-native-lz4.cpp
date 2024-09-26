#include "react-native-lz4.h"
#include <stdio.h>
#include "lz4.h"
#include <string>

namespace lz4 {
	double multiply(double a, double b) {
		return a * b * 3;
	}

	int getLz4VersionNumber() {
		int version = LZ4_versionNumber();
		return version;
	}

	std::string getLz4VersionString() {
        const char* version = LZ4_versionString();
        return std::string(version);
    }
}
