import { formatFilePath } from './utils/formatFilePath';
import type { FileOperationResult } from './types';
import { _global, Lz4 } from './module';

// @TODO: it might not be needed to initialize the module in the index file
// at all as it is being initialized in the Android and iOS layers. Could be removed in the future.

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

export type { FileOperationResult, FileOperationMode } from './types';
