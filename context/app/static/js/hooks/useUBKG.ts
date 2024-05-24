import { useAppContext } from 'js/components/Contexts';
import { fetcher } from 'js/helpers/swr';
import { SWRError } from 'js/helpers/swr/errors';
import { useMemo } from 'react';
import useSWR from 'swr';
import useSWRInfinite from 'swr/infinite';

/**
 * Generates API URLs for the UBKG API.
 * @returns A set of functions that generate URLs for the UBKG API.
 */
const useUbkg = () => {
  const { ubkgEndpoint } = useAppContext();
  return useMemo(
    () => ({
      geneDetail(geneId: string) {
        return `${ubkgEndpoint}/genes/${geneId.toUpperCase()}`;
      },
      get geneList() {
        return `${ubkgEndpoint}/genes-info`;
      },
      proteinDetail(proteinId: string) {
        return `${ubkgEndpoint}/proteins/${proteinId.toUpperCase()}`;
      },
      get proteinList() {
        return `${ubkgEndpoint}/proteins-info`;
      },
      cellTypeDetail(cellTypeId: string) {
        return `${ubkgEndpoint}/celltypes/${cellTypeId.toUpperCase()}`;
      },
      get cellTypeList() {
        return `${ubkgEndpoint}/celltypes-info`;
      },
      get fieldDescriptions() {
        return `${ubkgEndpoint}/field-descriptions`;
      },
      get fieldTypes() {
        return `${ubkgEndpoint}/field-types`;
      },
    }),
    [ubkgEndpoint],
  );
};

/**
 * Baseline gene information returned by the UBKG API
 * whenever a gene is searched for or referenced by another
 * entity.
 */
export interface BasicGeneInfo {
  approved_name: string;
  approved_symbol: string;
  summary: string;
}

/**
 * Response type for the gene list (`/genes-info`) endpoint.
 */
export interface GeneListResponse {
  genes: BasicGeneInfo[];
  pagination: {
    items_per_page: number;
    page: number;
    total_pages: number;
    starts_with: string;
    item_count: number;
  };
}

/**
 * Baseline organ information returned by the UBKG API
 * whenever an organ is referenced by another entity.
 */
export interface OrganInfo {
  id: string;
  source: string;
  name: string;
}

/**
 * Baseline cell type information returned by the UBKG API
 * whenever a cell type is referenced by another entity.
 */
export interface CellTypeReference {
  definition: string;
  id: string;
  name: string;
  organs: OrganInfo[];
  sources: string[];
}

/**
 * Biomarker information returned by the UBKG API
 * whenever the biomarkers for a cell type are provided.
 */
export interface CellTypeBiomarkerInfo {
  biomarker_type: string;
  entry: {
    id: string;
    name: string;
    symbol: string;
    vocabulary: string;
  };
  reference: string;
}

/**
 * Response type for the cell type info (`celltypes/:cellTypeId`) endpoint.
 */
export interface CellTypeDetail {
  biomarkers: CellTypeBiomarkerInfo[];
  cell_type: {
    cl_id: string;
    definition: string;
    name: string;
  };
  organs: {
    id: string;
    name: string;
    source: string;
  };
}

/**
 * Unwrapped response contents for the gene detail (`/genes/:geneId`) endpoint.
 */
export interface GeneDetail extends BasicGeneInfo {
  alias_names: string[];
  alias_symbols: string[];
  cell_types: CellTypeReference[];
  previous_symbols: string[];
  previous_names: string[];
  references: {
    id: string;
    source: string;
    url: string;
  }[];
}

/**
 * Wrapped response type for the gene detail (`/genes/:geneId`) endpoint.
 */
type GeneDetailResponse = [GeneDetail];

/**
 * Fetches the details for a gene from the UBKG API.
 * @param geneSymbol The gene symbol to fetch details for.
 * @returns The gene details, or an error if the gene is not found.
 */
export const useGeneOntologyDetail = (geneSymbol: string) => {
  const { data, error, ...swr } = useSWR<GeneDetailResponse, SWRError>(
    useUbkg().geneDetail(geneSymbol),
    (url: string) =>
      fetcher<GeneDetailResponse>({
        url,
        errorMessages: {
          404: `The gene ${geneSymbol} was not found.`,
        },
      }),
  );
  // Throw an error if the gene is not found
  if (error) {
    throw error;
  }
  return { data: data?.[0], ...swr };
};

/**
 * Fetches the list of genes from the UBKG API.
 * @param starts_with The string to filter the list of genes by.
 * @returns The list of genes.
 */
export const useGeneOntologyList = (starts_with: string) => {
  const apiUrls = useUbkg();
  const query = useMemo(
    () => ({
      genesperpage: '10',
      starts_with,
    }),
    [starts_with],
  );
  /**
   * Returns the key for the given page index in the SWR cache. If the current page number is the last page, and the
   * starts_with value is the same as the previous page, then we don't need to fetch any more pages.
   *
   * @param pageIndex The index of the page to fetch.
   * @param previousPageData The data from the previous page.
   * @returns
   */
  const getKey = (pageIndex: number, previousPageData: GeneListResponse | null) => {
    if (
      previousPageData &&
      previousPageData.pagination.page === previousPageData.pagination.total_pages &&
      starts_with === previousPageData.pagination.starts_with
    )
      return null;
    return `${apiUrls.geneList}?${new URLSearchParams({ ...query, page: String(pageIndex + 1) }).toString()}`;
  };
  return useSWRInfinite<GeneListResponse>(getKey, (url: string) => fetcher({ url }), {
    revalidateAll: false,
    revalidateFirstPage: false,
  });
};

export const useCellTypeOntologyDetail = (cellTypeId: string) => {
  const { data, error, ...swr } = useSWR<[CellTypeDetail], SWRError>(
    useUbkg().cellTypeDetail(cellTypeId),
    (url: string) =>
      fetcher<[CellTypeDetail]>({
        url,
        errorMessages: {
          404: `The cell type ${cellTypeId} was not found.`,
        },
      }),
    {
      revalidateOnFocus: false,
    },
  );
  // Throw an error if the cell type is not found
  if (error) {
    throw error;
  }
  return { data: data?.[0], ...swr };
};
interface Description {
  // HMFIELD refers to legacy metadata.
  source: 'HMFIELD' | 'CEDAR';
  description: string;
}

type XSDType = 'string' | 'float' | 'anyURI' | 'int' | 'integer' | 'decimal' | 'boolean' | 'dateTime' | 'date' | 'long';
type HMFIELDType = 'string' | 'number' | 'integer' | 'boolean' | 'datetime' | 'date';
type MetadataType =
  | {
      mapping_source: 'HMFIELD' | 'CEDAR';
      type: XSDType;
      type_source: 'XSD';
    }
  | {
      mapping_source: 'HMFIELD';
      type: HMFIELDType;
      type_source: 'HMFIELD';
    };

export interface MetadataField {
  code_ids: string[];
  name: string;
}

interface MetadataFieldDescription extends MetadataField {
  descriptions: Description[];
}

interface MetadataFieldType extends MetadataField {
  types: MetadataType[];
}

export function buildFieldsMap<T extends MetadataField>({
  fields,
  getValue,
}: {
  fields: T[];
  getValue: (field: T) => string;
}) {
  if (!fields) {
    return {};
  }

  const fieldsMap = fields.reduce<Record<string, string>>((acc, field) => {
    const value = getValue(field);
    if (value) {
      return { ...acc, [field.name]: value };
    }
    return acc;
  }, {});

  return fieldsMap;
}

export function mapXSDTypetoHMFIELD(type: string) {
  switch (type) {
    case 'anyURI':
      return 'string';
    case 'float':
    case 'decimal':
    case 'long':
      return 'number';
    case 'int':
      return 'integer';
    case 'dateTime':
      return 'datetime';
    default:
      return type;
  }
}

export function findBestType(types: MetadataType[]) {
  const hmtype = types.find((t) => t?.type_source === 'HMFIELD');

  return hmtype?.type ?? mapXSDTypetoHMFIELD(types[0].type);
}

async function fetchFieldTypes(url: string) {
  const data = await fetcher<MetadataFieldType[]>({ url });
  return buildFieldsMap({ fields: data, getValue: (f) => findBestType(f.types) });
}

export const useMetadataFieldTypes = () => {
  const { data, ...swr } = useSWR<Record<string, string> | Record<string, never>>(
    useUbkg().fieldTypes,
    (url: string) => fetchFieldTypes(url),
    {
      fallbackData: {},
    },
  );

  return { data: data ?? {}, ...swr };
};

export function findBestDescription(descriptions: Description[]) {
  const cedarDescription = descriptions.find((description) => description?.source === 'CEDAR');

  return (cedarDescription ?? descriptions[0]).description;
}

async function fetchDescriptions(url: string) {
  const data = await fetcher<MetadataFieldDescription[]>({ url });
  return buildFieldsMap<MetadataFieldDescription>({
    fields: data,
    getValue: (f) => {
      const descriptions = f?.descriptions;
      if (descriptions) {
        return findBestDescription(descriptions);
      }
      return '';
    },
  });
}

// Since both flask and js depend on manipulated field descriptions, get them from flask for now in the hook below. Keeping this here for future use.
export const useMFD = () => {
  const { data, ...swr } = useSWR<Record<string, string> | Record<string, never>>(
    useUbkg().fieldDescriptions,
    (url: string) => fetchDescriptions(url),
    {
      fallbackData: {},
    },
  );

  return { data: data ?? {}, ...swr };
};

export const useMetadataFieldDescriptions = () => {
  const { data, ...swr } = useSWR<Record<string, string>>('/metadata/descriptions', (url: string) => fetcher({ url }), {
    fallbackData: {},
  });

  return { data: data ?? {}, ...swr };
};
