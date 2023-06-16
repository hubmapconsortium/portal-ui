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

export const useCellTypeDescription = (cellType, shouldFetch) => {
  const { data, error } = useSWR(() => (shouldFetch ? `/cell-types/${cellType}/description.json` : null), fetcher, {
    revalidateOnFocus: false,
  });
  return {
    description: data,
    isLoading: !error && !data,
    isError: error,
  };
};

export const useCellTypeOrgans = (cellType, shouldFetch) => {
  const { data, error } = useSWR(() => (shouldFetch ? `/cell-types/${cellType}/organs.json` : null), fetcher, {
    revalidateOnFocus: false,
  });
  return {
    organs: data,
    isLoading: !error && !data,
    isError: error,
  };
};

export const useCellTypeDatasets = (cellType, shouldFetch) => {
  const { data, error } = useSWR(() => (shouldFetch ? `/cell-types/${cellType}/datasets.json` : null), fetcher, {
    revalidateOnFocus: false,
  });
  return {
    datasets: data,
    isLoading: !error && !data,
    isError: error,
  };
};

export const useCellTypeAssays = (cellType, shouldFetch) => {
  const { data, error } = useSWR(() => (shouldFetch ? `/cell-types/${cellType}/assays.json` : null), fetcher, {
    revalidateOnFocus: false,
  });
  return {
    assays: data,
    isLoading: !error && !data,
    isError: error,
  };
};
