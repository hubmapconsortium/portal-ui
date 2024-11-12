import { createDownloadUrl } from 'js/helpers/functions';

interface DownloadFileProps {
  url: string;
  fileName: string;
}
export function downloadFile({ url, fileName }: DownloadFileProps) {
  const tempLink = document.createElement('a');
  tempLink.href = url;
  tempLink.download = fileName;
  tempLink.click();
  tempLink.remove();
}

interface PostAndDownloadFileProps {
  url: RequestInfo | URL;
  body: unknown;
  fileName?: string;
  defaultFileName?: string;
  defaultMimeType?: string;
}

export default async function postAndDownloadFile({
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
  downloadFile({ url: downloadUrl, fileName: name });
}
