const FILE_PROTOCOL = 'file://';

export function formatFilePath(filePath: string): string {
  if (filePath.startsWith(FILE_PROTOCOL)) {
    return filePath.replace(FILE_PROTOCOL, '');
  }

  return filePath;
}
