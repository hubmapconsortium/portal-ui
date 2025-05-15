import { createDownloadUrl } from 'js/helpers/functions';
import { useSnackbarActions } from 'js/shared-styles/snackbars/store';

interface CheckAndDownloadFileProps {
  url: string;
  fileName: string;
}
export async function checkAndDownloadFile({ url, fileName }: CheckAndDownloadFileProps) {
  try {
    // Check file status
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch file: ${response.status}`);
    }

    // Check that file type is as expected (e.g. not 'text/html' for error pages)
    const contentType = response.headers.get('content-type');
    if (contentType?.includes('text/html')) {
      throw new Error('Unexpected content type.');
    }

    const blob = await response.blob();
    const blobUrl = window.URL.createObjectURL(blob);

    // Trigger download with validated url
    const tempLink = document.createElement('a');
    tempLink.href = blobUrl;
    tempLink.download = fileName;
    tempLink.click();
    tempLink.remove();
  } catch (error) {
    console.error('Error:', error);
    throw new Error('File download failed.');
  }
}

interface PostAndDownloadFileProps {
  url: RequestInfo | URL;
  body: unknown;
  fileName?: string;
  defaultFileName?: string;
  defaultMimeType?: string;
}

export async function postAndDownloadFile({
  url,
  body,
  fileName,
  defaultFileName = 'download',
  defaultMimeType = 'application/octet-stream',
}: PostAndDownloadFileProps) {
  const response = await fetch(url, {
    method: 'POST',
    body: JSON.stringify(body),
    headers: {
      'Content-Type': 'application/json',
    },
  });
  if (!response.ok) {
    console.error('Download failed', response);
    throw new Error(`Download failed with status: ${response.status}`);
  }

  const results = await response.blob();
  // If no file name is provided, use the server's, otherwise use a default one
  const name = fileName ?? response.headers.get('content-disposition')?.split('=')[1] ?? defaultFileName;
  const mime = response.headers.get('content-type') ?? defaultMimeType;

  const downloadUrl = createDownloadUrl(results, mime);
  checkAndDownloadFile({ url: downloadUrl, fileName: name }).catch((error) => {
    console.error('Download failed', error);
    throw error;
  });
}

export interface tableData {
  columnNames: string[];
  rows: string[][];
  fileName?: string;
}
export function useDownloadTable({ columnNames, rows, fileName }: tableData) {
  const { toastError, toastSuccess } = useSnackbarActions();

  return function downloadTable() {
    const formattedHeader = columnNames.join('\t');
    const formattedRows = rows.map((row) => row.join('\t'));

    const tsvContent = [formattedHeader, ...formattedRows].join('\n');
    const url = createDownloadUrl(tsvContent, 'text/table');

    checkAndDownloadFile({ url, fileName: fileName ?? 'table.tsv' })
      .then(() => {
        toastSuccess('Table downloaded successfully.');
      })
      .catch((e) => {
        toastError('Error downloading table. Please try again.');
        console.error(e);
      });
  };
}
