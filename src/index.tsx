import { NativeModules, Platform } from 'react-native';
import { formatFilePath } from './utils/formatFilePath';
import type { FileOperationResult, Lz4Type } from './types';

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

export const _global = global as unknown as Lz4Type;

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
 * @param onProgress A callback function that is called with the progress of the operation.
 * @returns A promise that resolves to a FileOperationResult object.
 */
export function compressFile(
  sourcePath: string,
  destinationPath: string,
  onProgress?: (processedSize: number, totalSize: number) => void
): Promise<FileOperationResult> {
  const strippedSourcePath = formatFilePath(sourcePath);
  const strippedDestinationPath = formatFilePath(destinationPath);

  return _global.lz4.performFileOperation(
    'compress',
    strippedSourcePath,
    strippedDestinationPath,
    onProgress
  );
}

/**
 * Decompresses a file that was compressed using the Lz4 algorithm.
 * @param sourcePath The path to the file to decompress.
 * @param destinationPath The path to save the decompressed file.
 * @param onProgress A callback function that is called with the progress of the operation.
 * @returns A promise that resolves to a FileOperationResult object.
 */
export function decompressFile(
  sourcePath: string,
  destinationPath: string,
  onProgress?: (processedSize: number, totalSize: number) => void
): Promise<FileOperationResult> {
  const strippedSourcePath = formatFilePath(sourcePath);
  const strippedDestinationPath = formatFilePath(destinationPath);

  return _global.lz4.performFileOperation(
    'decompress',
    strippedSourcePath,
    strippedDestinationPath,
    onProgress
  );
}

export * from './types';
