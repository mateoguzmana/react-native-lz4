# react-native-lz4

LZ4 – React Native bindings for an extremely fast compression algorithm.

Compress and decompress files using the LZ4 algorithm in React Native. This library binds the [LZ4 C library](https://github.com/lz4/lz4) to React Native via C++ TurboModules.

The library could also be extended to support other LZ4 features if needed.

## Installation

```sh
npm install react-native-lz4
```

## Usage

```ts
import { compressFile, decompressFile } from 'react-native-lz4';

const compressionResult = await compressFile('path/to/file', 'path/to/output');
const decompressionResult = await decompressFile('path/to/file', 'path/to/output');

console.log(compressionResult)
// { success: true, message: 'File compressed successfully', originalSize: 100, finalSize: 50 }

console.log(decompressionResult)
// { success: true, message: 'File decompressed successfully', originalSize: 50, finalSize: 100 }
```

## Contributing

See the [contributing guide](CONTRIBUTING.md) to learn how to contribute to the repository and the development workflow.

## License

MIT
