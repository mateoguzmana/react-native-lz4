import { formatFilePath } from '../formatFilePath';

describe('formatFilePath', () => {
  it('should return the path with the file:// prefix removed', () => {
    const path = 'file:///path/to/file.txt';
    const result = formatFilePath(path);

    expect(result).toBe('/path/to/file.txt');
  });
});
