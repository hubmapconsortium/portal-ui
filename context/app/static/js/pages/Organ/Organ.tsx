import React, { useEffect } from 'react';
import Typography from '@mui/material/Typography';

import Assays from 'js/components/organ/Assays';
import CellTypes from 'js/components/organ/OrganCellTypes';
import Description from 'js/components/organ/Description';
import HumanReferenceAtlas from 'js/components/organ/HumanReferenceAtlas';
import Samples from 'js/components/organ/Samples';
import { OrganFile, OrganPageIds } from 'js/components/organ/types';
import DetailLayout from 'js/components/detailPage/DetailLayout';
import CellPopulationPlot from 'js/components/organ/CellPop';
import IntegratedMaps from 'js/components/organ/DataProducts';
import { OrganContextProvider } from 'js/components/organ/contexts';
import useEntityStore from 'js/stores/useEntityStore';
import SummaryTitle from 'js/components/detailPage/summary/SummaryTitle';
import useOrganCellTypesData from 'js/api/scfind/useOrganCellTypesData';
import {
  useAssayBucketsQuery,
  useDataProducts,
  useHasSamplesQuery,
  useSearchItems,
  useCombinedIndexedDatasetsForOrgan,
} from './hooks';

interface OrganProps {
  organ: OrganFile;
}

const { summaryId, hraId, scellopId, cellTypesId, assaysId, integratedMapsId, samplesId } = OrganPageIds;

function Organ({ organ }: OrganProps) {
  const setOrganFile = useEntityStore((state) => state.setOrganFile);

  const searchItems = useSearchItems(organ);
  const assayBuckets = useAssayBucketsQuery(searchItems);
  const samplesHits = useHasSamplesQuery(searchItems);
  const scFind = useCombinedIndexedDatasetsForOrgan(searchItems, organ.name);
  const { dataProducts, isLoading, isLateral } = useDataProducts(organ);
  // Shared (SWR-deduped) with the cell-types section's provider; used here to decide whether to show
  // the section, accounting for both modalities (e.g. an ATAC-only organ).
  const { data: organCellTypesData } = useOrganCellTypesData(organ.name);
  const hasCellTypes =
    (organCellTypesData?.cell_types.length ?? 0) > 0 || (organCellTypesData?.cell_types_atac.length ?? 0) > 0;

  // Set the organ file in the entity store for the header
  useEffect(() => {
    setOrganFile(organ);

    // Clean up when component unmounts
    return () => {
      setOrganFile(null);
    };
  }, [organ, setOrganFile]);

  const shouldDisplaySection: Record<string, boolean> = {
    [summaryId]: Boolean(organ?.description),
    [hraId]: Boolean(organ.has_iu_component),
    [scellopId]: scFind.datasets.length > 0,
    [cellTypesId]: hasCellTypes,
    [assaysId]: assayBuckets.length > 0,
    [integratedMapsId]: dataProducts.length > 0,
    [samplesId]: samplesHits.length > 0,
  };

  return (
    <OrganContextProvider organ={organ}>
      <DetailLayout sections={shouldDisplaySection} isLoading={isLoading}>
        <SummaryTitle organIcon={organ.name} data-testid="organs-title">
          Organ
        </SummaryTitle>
        <Typography variant="h1" component="h2" data-testid="entity-title">
          {organ.name}
        </Typography>
        <Description shouldDisplay={shouldDisplaySection[summaryId]} />
        <HumanReferenceAtlas shouldDisplay={shouldDisplaySection[hraId]} />
        <CellPopulationPlot
          rnaUuids={scFind.rnaDatasets}
          atacUuids={scFind.atacDatasets}
          shouldDisplay={shouldDisplaySection[scellopId]}
          organ={organ.name}
        />
        <CellTypes shouldDisplay={shouldDisplaySection[cellTypesId]} />
        <Assays organTerms={searchItems} bucketData={assayBuckets} shouldDisplay={shouldDisplaySection[assaysId]} />
        <IntegratedMaps
          dataProducts={dataProducts}
          isLateral={isLateral}
          isLoading={isLoading}
          shouldDisplay={shouldDisplaySection[integratedMapsId]}
        />
        <Samples organTerms={searchItems} shouldDisplay={shouldDisplaySection[samplesId]} />
      </DetailLayout>
    </OrganContextProvider>
  );
}

export default Organ;
