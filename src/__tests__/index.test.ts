import {
  compressFile,
  decompressFile,
  getLz4VersionNumber,
  getLz4VersionString,
  type FileOperationResult,
} from '../index';
import { _global } from '../module';

jest.mock('react-native', () => ({
  Platform: {
    select: jest.fn(),
  },
  NativeModules: {
    Lz4: {
      initializeLz4: jest.fn(),
    },
  },
}));

describe('LZ4 Module', () => {
  const fileOperationResult: FileOperationResult = {
    success: true,
    message: 'File operation successful',
    originalSize: 1000,
    finalSize: 500,
  };
  const onProgress = () => {};

  beforeAll(() => {
    // set the global object, as the lz4 native module would
    (global as any).lz4 = {
      getLz4VersionNumber: jest.fn(() => Promise.resolve(1001)),
      getLz4VersionString: jest.fn(() => Promise.resolve('1.0.0')),
      performFileOperation: jest.fn(() => fileOperationResult),
    };
  });

  it('should call getLz4VersionNumber and return version', async () => {
    const version = await getLz4VersionNumber();

    expect(_global.lz4.getLz4VersionNumber).toHaveBeenCalled();
    expect(version).toBe(1001);
  });

  it('should call getLz4VersionString and return version', async () => {
    const version = await getLz4VersionString();

    expect(_global.lz4.getLz4VersionString).toHaveBeenCalled();
    expect(version).toBe('1.0.0');
  });

  it('should call compressFile and return result', async () => {
    const result = await compressFile('source', 'destination', onProgress);

    expect(_global.lz4.performFileOperation).toHaveBeenCalledWith(
      'compress',
      'source',
      'destination',
      onProgress
    );
    expect(result).toEqual(fileOperationResult);
  });

  it('should call decompressFile and return result', async () => {
    const result = await decompressFile('source', 'destination', onProgress);

    expect(_global.lz4.performFileOperation).toHaveBeenCalledWith(
      'decompress',
      'source',
      'destination',
      onProgress
    );
    expect(result).toEqual(fileOperationResult);
  });
});
