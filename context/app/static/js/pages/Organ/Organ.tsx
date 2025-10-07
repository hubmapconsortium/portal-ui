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
import DataProducts from 'js/components/organ/DataProducts';
import { OrganContextProvider } from 'js/components/organ/contexts';
import useEntityStore from 'js/stores/useEntityStore';
import SummaryTitle from 'js/components/detailPage/summary/SummaryTitle';
import {
  useAssayBucketsQuery,
  useDataProducts,
  useHasSamplesQuery,
  useLabelledDatasetsQuery,
  useCellTypesOfOrgan,
  useSearchItems,
} from './hooks';

interface OrganProps {
  organ: OrganFile;
}

const { summaryId, hraId, cellpopId, cellTypesId, referenceId, assaysId, dataProductsId, samplesId } = OrganPageIds;

function Organ({ organ }: OrganProps) {
  const setOrganFile = useEntityStore((state) => state.setOrganFile);

  const searchItems = useSearchItems(organ);
  const assayBuckets = useAssayBucketsQuery(searchItems);
  const samplesHits = useHasSamplesQuery(searchItems);
  const labeledDatasetUuids = useLabelledDatasetsQuery(searchItems);
  const { dataProducts, isLoading, isLateral } = useDataProducts(organ);
  const cellTypes = useCellTypesOfOrgan(organ.name);

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
    [cellpopId]: labeledDatasetUuids.length > 0,
    [cellTypesId]: cellTypes.length > 0,
    [referenceId]: false, // TODO: Azimuth reference data are currently broken - we will restore this once we have updated data for pan-organ
    [assaysId]: assayBuckets.length > 0,
    [dataProductsId]: dataProducts.length > 0,
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
          uuids={labeledDatasetUuids}
          shouldDisplay={shouldDisplaySection[cellpopId]}
          organ={organ.name}
        />
        <CellTypes shouldDisplay={shouldDisplaySection[cellTypesId]} cellTypes={cellTypes} />
        <Assays organTerms={searchItems} bucketData={assayBuckets} shouldDisplay={shouldDisplaySection[assaysId]} />
        <DataProducts
          dataProducts={dataProducts}
          isLateral={isLateral}
          isLoading={isLoading}
          shouldDisplay={shouldDisplaySection[dataProductsId]}
        />
        <Samples organTerms={searchItems} shouldDisplay={shouldDisplaySection[samplesId]} />
      </DetailLayout>
    </OrganContextProvider>
  );
}

export default Organ;
