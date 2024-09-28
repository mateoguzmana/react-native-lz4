# react-native-lz4

LZ4 – React Native bindings for an extremely fast compression algorithm.

## Installation

```sh
npm install react-native-lz4
```

## Usage

```ts
import { compressFile, decompressFile } from 'react-native-lz4';

const didCompress = await compressFile('path/to/file', 'path/to/output');
const didDecompress = await decompressFile('path/to/file', 'path/to/output');

console.log({ didCompress, didDecompress });
```

## Contributing

See the [contributing guide](CONTRIBUTING.md) to learn how to contribute to the repository and the development workflow.

## License

MIT
