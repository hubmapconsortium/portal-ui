import LZString from 'lz-string';

export function compressStringList(stringList: string[]): string {
  const joinedList = stringList.join(',');
  return LZString.compressToBase64(joinedList);
}

export function decompressStringList(uuidListStr: string): string[] {
  const decompressedStringList = LZString.decompressFromBase64(uuidListStr);
  return decompressedStringList.split(',');
}
