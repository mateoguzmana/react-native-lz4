const FILE_PROTOCOL = 'file://';

/**
 * Formats a file path by removing the file:// prefix.
 * @param filePath The file path to format.
 * @returns The formatted file path.
 */
export function formatFilePath(filePath: string): string {
  if (filePath.startsWith(FILE_PROTOCOL)) {
    return filePath.replace(FILE_PROTOCOL, '');
  }

  return filePath;
}
