import { CompositeBucket } from './hooks';

export function getAgeLabels(buckets: CompositeBucket[], key: string): string[] {
  return [...new Set(buckets.map((b) => (b.key[key] === 0 ? '<10' : `${b.key[key]}-${Number(b.key[key]) + 9}`)))];
}

export function getBloodTypeLabels(buckets: CompositeBucket[], key: string): string[] {
  return [...new Set(buckets.map((b) => String(b.key[key]).replace('Blood Type', '').trim()))];
}

export function getKeyValues(buckets: CompositeBucket[], key: string): (string | number)[] {
  return [...new Set(buckets.map((b) => b.key[key]))];
}

export function getUniqueComparisonKeys(buckets: CompositeBucket[], key: string): string[] {
  const uniqueValues = [...new Set(buckets.map((b) => b.key[key]))];
  // Sort to ensure consistent ordering, with 'Multiple' at the end if present
  return uniqueValues.map(String).sort((a, b) => {
    if (a === 'Multiple') return 1;
    if (b === 'Multiple') return -1;
    return a.localeCompare(b);
  });
}

interface TermSource {
  [key: string]: {
    terms: {
      field: string;
    };
  };
}

export function makeTermSource(field: string): TermSource {
  const esField = `mapped_metadata.${field}`;
  const source: TermSource = {};
  source[esField] = {
    terms: {
      field: `mapped_metadata.${field}.keyword`,
    },
  };
  return source;
}

interface HistogramSource {
  [key: string]: {
    histogram: {
      field: string;
      interval: number;
    };
  };
}

export function makeHistogramSource(field: string): HistogramSource {
  const esField = `mapped_metadata.${field}`;
  const source: HistogramSource = {};
  source[esField] = {
    histogram: {
      field: `${esField}_value`,
      interval: 10,
    },
  };
  return source;
}

export interface CompositeQuery {
  size: number;
  aggs: {
    composite_data: {
      composite: {
        sources: Array<TermSource | HistogramSource>;
        size: number;
      };
    };
  };
}

export function makeCompositeQuery(
  source1: TermSource | HistogramSource,
  source2: TermSource | HistogramSource,
): CompositeQuery {
  return {
    size: 0,
    aggs: {
      composite_data: {
        composite: {
          sources: [source1, source2],
          size: 10000,
        },
      },
    },
  };
}
