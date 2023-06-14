import useSWR from 'swr';

const fetcher = (url) => fetch(url, { type: 'application/json' }).then((res) => res.json());

export const useCellTypesList = () => {
  const { data, error } = useSWR(`/cell-types/list.json`, fetcher, {
    revalidateOnFocus: false,
  });
  return {
    cellTypes: data,
    isLoading: !error && !data,
    isError: error,
  };
};
