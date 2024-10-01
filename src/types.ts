/**
 * Represents the result of a file operation.
 */
export interface FileOperationResult {
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

/**
 * Represents the mode of a file operation.
 */
export type FileOperationMode = 'compress' | 'decompress';

export interface Lz4Type {
  lz4: {
    getLz4VersionNumber: () => Promise<number>;
    getLz4VersionString: () => Promise<string>;
    performFileOperation: (
      mode: FileOperationMode,
      sourcePath: string,
      destinationPath: string,
      onProgress?: (processedSize: number, totalSize: number) => void
    ) => Promise<FileOperationResult>;
  };
}
