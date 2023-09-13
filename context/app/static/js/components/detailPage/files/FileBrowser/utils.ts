import { UnprocessedFile, FileTree, DatasetFile } from '../types';

// Helper to generate an empty object typed as a FileTree
const createEmptyTreeNode = () => ({}) as FileTree;

/**
 * Takes an array of objects each containing a file path and returns an object representing the directory structure in a tree like organization.
 * @param  {UnprocessedFile[]} files Array of objects each containing a key, rel_path, which is the file path.
 * @return {FileTree}      The directory structure in a tree like organization.
 */
export function relativeFilePathsToTree(files: UnprocessedFile[]) {
  const treePath = createEmptyTreeNode();
  files.forEach((f) => {
    const dirs = f.rel_path.split('/');
    const file = dirs.pop();

    const fileObj = { file, ...f } as DatasetFile;

    let currentDir = treePath;

    // Iterate through directory levels
    // If no directories, currentDir will remain root of tree
    dirs.forEach((dir) => {
      const path = `${dir}/`;
      if (!currentDir[path]) {
        currentDir[path] = createEmptyTreeNode();
      }
      currentDir = currentDir[path];
    });

    // Add file to current directory, creating a new array if needed.
    currentDir.files = currentDir.files || [];
    currentDir.files.push(fileObj);
  });

  return treePath;
}
