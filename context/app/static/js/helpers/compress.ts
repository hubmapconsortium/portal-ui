import LZString from 'lz-string';

export function compressStringList(stringList: string[]): string {
  const joinedList = stringList.join(',');
  return LZString.compressToEncodedURIComponent(joinedList);
}

export function decompressStringList(uuidListStr: string): string[] {
  const decompressedStringList = LZString.decompressFromEncodedURIComponent(uuidListStr);
  return decompressedStringList.split(',');
}
