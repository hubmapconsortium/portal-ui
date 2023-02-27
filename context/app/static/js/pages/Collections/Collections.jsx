import React from 'react';
import Typography from '@material-ui/core/Typography';

import { useSearchHits } from 'js/hooks/useSearchData';
import { getAllCollectionsQuery } from 'js/helpers/queries';
import PanelListLandingPage from 'js/shared-styles/panels/PanelListLandingPage';

const description =
  'Collections of HuBMAP datasets represent data from related experiments—such as assays performed on the same organ—or data that has been grouped for other reasons. In the future, it will be possible to reference collections through Document Object Identifiers (DOIs).';

function Collections() {
  const { searchHits: collectionsData } = useSearchHits(getAllCollectionsQuery);

  const panelsProps = collectionsData.map(({ _source }) => ({
    key: _source.uuid,
    href: `/browse/collection/${_source.uuid}`,
    title: _source.title,
    secondaryText: _source.hubmap_id,
    rightText: <Typography variant="caption">{`${_source.datasets.length} Datasets`}</Typography>,
  }));

  return (
    <PanelListLandingPage
      title="Collections"
      subtitle={collectionsData.length > 0 && `${collectionsData.length} Collections`}
      description={description}
      panelsProps={panelsProps}
    />
  );
}

export default Collections;
