import { NativeModules, Platform } from 'react-native';
import { formatFilePath } from './utils/formatFilePath';

const LINKING_ERROR =
  `The package 'react-native-lz4' doesn't seem to be linked. Make sure: \n\n` +
  Platform.select({ ios: "- You have run 'pod install'\n", default: '' }) +
  '- You rebuilt the app after installing the package\n' +
  '- You are not using Expo Go\n';

// @ts-expect-error
const isTurboModuleEnabled = global.__turboModuleProxy != null;

const Lz4Module = isTurboModuleEnabled
  ? require('./NativeLz4').default
  : NativeModules.Lz4;

const Lz4 = Lz4Module
  ? Lz4Module
  : new Proxy(
      {},
      {
        get() {
          throw new Error(LINKING_ERROR);
        },
      }
    );

/**
 * Represents the result of a file operation.
 */
interface FileOperationResult {
  /**
   * Indicates whether the operation was successful.
   */
  success: boolean;
  /**
   * A message describing the result of the operation.
   */
  message: string;
  /**
   * The original size of the file in bytes.
   */
  originalSize: number;
  /**
   * The final size of the file in bytes. Represents the size of the compressed or decompressed file.
   */
  finalSize: number;
}

interface Lz4Type {
  lz4: {
    getLz4VersionNumber: () => Promise<number>;
    getLz4VersionString: () => Promise<string>;
    compressFile: (
      sourcePath: string,
      destinationPath: string
    ) => Promise<FileOperationResult>;
    decompressFile: (
      sourcePath: string,
      destinationPath: string
    ) => Promise<FileOperationResult>;
  };
}

const _global = global as unknown as Lz4Type;

/**
 * Initializes the Lz4 module.
 * This method should be called before any other method.
 * By default, this method is called automatically when the module is imported.
 */
export function initializeLz4(): void {
  return Lz4.initializeLz4();
}

// Initialize the Lz4 module when the module is imported.
(() => {
  initializeLz4();
})();

/**
 * Gets the version number of the Lz4 library.
 * @returns The version number of the Lz4 library.
 */
export function getLz4VersionNumber(): Promise<number> {
  return _global.lz4.getLz4VersionNumber();
}

/**
 * Gets the version string of the Lz4 library.
 * @returns The version string of the Lz4 library.
 */
export function getLz4VersionString(): Promise<string> {
  return _global.lz4.getLz4VersionString();
}

/**
 * Compresses a file using the Lz4 algorithm.
 * @param sourcePath The path to the file to compress.
 * @param destinationPath The path to save the compressed file.
 * @returns A promise that resolves to a FileOperationResult object.
 */
export function compressFile(
  sourcePath: string,
  destinationPath: string
): Promise<FileOperationResult> {
  const strippedSourcePath = formatFilePath(sourcePath);
  const strippedDestinationPath = formatFilePath(destinationPath);

  return _global.lz4.compressFile(strippedSourcePath, strippedDestinationPath);
}

/**
 * Decompresses a file that was compressed using the Lz4 algorithm.
 * @param sourcePath The path to the file to decompress.
 * @param destinationPath The path to save the decompressed file.
 * @returns A promise that resolves to a FileOperationResult object.
 */
export function decompressFile(
  sourcePath: string,
  destinationPath: string
): Promise<FileOperationResult> {
  const strippedSourcePath = formatFilePath(sourcePath);
  const strippedDestinationPath = formatFilePath(destinationPath);

  return _global.lz4.decompressFile(
    strippedSourcePath,
    strippedDestinationPath
  );
}
