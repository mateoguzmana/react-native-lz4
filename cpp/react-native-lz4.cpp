#include "react-native-lz4.h"
#include <stdio.h>
#include "lz4.h"

namespace lz4 {
	double multiply(double a, double b) {
		return a * b;
	}

	int getLz4VersionNumber() {
		int version = LZ4_versionNumber();
		printf("Version inside getLz4VersionNumber: %d\n", version);
		return version;
	}
}
