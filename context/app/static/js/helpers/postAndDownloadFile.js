import { createDownloadUrl } from 'js/helpers/functions';

export default async function postAndDownloadFile({ url, body }) {
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
  const name = response.headers.get('content-disposition').split('=')[1];
  const mime = response.headers.get('content-type');

  const downloadUrl = createDownloadUrl(results, mime);
  const tempLink = document.createElement('a');
  tempLink.href = downloadUrl;
  tempLink.download = name;
  tempLink.click();
}
