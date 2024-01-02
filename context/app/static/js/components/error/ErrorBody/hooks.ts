import useSWR from 'swr';

export default function useMaintenanceMessage() {
  const swr = useSWR<string, unknown, string>(
    `${CDN_URL}/maintenance-message.md`,
    async (url) => {
      const request = await fetch(url);
      const markdownText = await request.text();
      return markdownText;
    },
    {
      shouldRetryOnError: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      refreshInterval: 0,
    },
  );
  return swr;
}
