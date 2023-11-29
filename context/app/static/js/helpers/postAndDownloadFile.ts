import { createDownloadUrl } from 'js/helpers/functions';

interface PostAndDownloadFileArgs {
  url: RequestInfo | URL;
  body: unknown;
  defaultFileName?: string;
  defaultMimeType?: string;
}

export default async function postAndDownloadFile({
  url,
  body,
  defaultFileName = 'download',
  defaultMimeType = 'application/octet-stream',
}: PostAndDownloadFileArgs) {
  const response = await fetch(url, {
    method: 'POST',
    body: JSON.stringify(body),
    headers: {
      'Content-Type': 'application/json',
    },
  });
  if (!response.ok) {
    console.error('Download failed', response);
    return;
  }

  const results = await response.blob();
  // If the server doesn't send a filename, use a default one
  const name = response.headers.get('content-disposition')?.split('=')[1] ?? defaultFileName;
  const mime = response.headers.get('content-type') ?? defaultMimeType;

  const downloadUrl = createDownloadUrl(results, mime);
  const tempLink = document.createElement('a');
  tempLink.href = downloadUrl;
  tempLink.download = name;
  tempLink.click();
  tempLink.remove();
}
