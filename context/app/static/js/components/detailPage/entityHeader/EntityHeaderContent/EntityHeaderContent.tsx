import React from 'react';
import { animated, useSpring } from '@react-spring/web';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import VizualizationThemeSwitch from 'js/components/detailPage/visualization/VisualizationThemeSwitch';
import VisualizationCollapseButton from 'js/components/detailPage/visualization/VisualizationCollapseButton';
import VisualizationNotebookButton from 'js/components/detailPage/visualization/VisualizationNotebookButton';
import { AllEntityTypes, entityIconMap } from 'js/shared-styles/icons/entityIconMap';
import { useHandleCopyClick } from 'js/hooks/useCopyText';
import { TooltipIconButton } from 'js/shared-styles/buttons/TooltipButton';
import useEntityStore, { type EntityStore, SummaryViewsType } from 'js/stores/useEntityStore';
import { useVisualizationStore, type VisualizationStore } from 'js/stores/useVisualizationStore';
import { useFlaskDataContext } from 'js/components/Contexts';
import { Entity, isDataset, isDonor, isPublication, isSample } from 'js/components/types';
import EntityIcon from 'js/shared-styles/icons/EntityIcon';

import { getDonorMetadata, getOriginSampleAndMappedOrgan } from '../../utils';

import { StyledSvgIcon, RightDiv } from './style';
import EntityHeaderItem from '../EntityHeaderItem';
import VisualizationShareButtonWrapper from '../VisualizationShareButtonWrapper';
import EntityHeaderActionButtons from '../EntityHeaderActionButtons';
import StatusIcon from '../../StatusIcon';

type EntityTypesWithIcons = Exclude<
  keyof typeof entityIconMap,
  'Support' | 'Collection' | 'Workspace' | 'VerifiedUser'
>;

export interface AssayMetadata {
  entity_type: AllEntityTypes;
  name: string;
  reference_link: React.ReactNode;
  citationTitle?: string;
}

interface EntityHeaderItemsProps {
  data: {
    assayMetadata: Partial<AssayMetadata>;
    entity: Entity;
  };
}

type EntityToFieldsType = Record<EntityTypesWithIcons, (props: EntityHeaderItemsProps) => React.ReactNode | null>;

const entityTypeHasIcon = (entityType: string): entityType is EntityTypesWithIcons => {
  return entityType in entityIconMap;
};

function DonorItems({ data: { entity } }: EntityHeaderItemsProps) {
  if (!isDonor(entity) || !isSample(entity) || isDataset(entity)) {
    return null;
  }

  const { sex, race, age_unit, age_value } = getDonorMetadata(entity);

  return (
    <>
      {sex && <Typography>{sex}</Typography>}
      {race && <Typography>{race}</Typography>}
      {age_unit && age_value && (
        <Typography>
          {age_value} {age_unit}
        </Typography>
      )}
    </>
  );
}

function SampleItems({ data: { entity } }: EntityHeaderItemsProps) {
  if (!isSample(entity)) {
    return null;
  }

  const { mapped_organ } = getOriginSampleAndMappedOrgan(entity);
  const { sample_category } = entity;

  return (
    <>
      <Typography>{mapped_organ}</Typography>
      <Typography>{sample_category}</Typography>
    </>
  );
}

function DatasetItems({ data: { entity } }: EntityHeaderItemsProps) {
  if (!isDataset(entity)) {
    return null;
  }
  const { assay_display_name, entity_type, status, mapped_data_access_level } = entity;
  const { mapped_organ } = getOriginSampleAndMappedOrgan(entity);

  return (
    <>
      <Typography>
        <EntityIcon entity_type={entity_type} sx={{ alignSelf: 'center', marginRight: 1 }} />
        {assay_display_name}
      </Typography>
      <Typography>{mapped_organ}</Typography>
      <Typography>
        <StatusIcon status={status} sx={{ marginRight: 1 }} /> {status} ({mapped_data_access_level})
      </Typography>
    </>
  );
}

function PublicationItems({ data: { entity } }: EntityHeaderItemsProps) {
  if (!isPublication(entity)) {
    return null;
  }

  const { title, publication_venue } = entity;

  return (
    <>
      <Typography>{title}</Typography>
      <Typography>{publication_venue}</Typography>
    </>
  );
}

function CellTypeItems({ data: { assayMetadata } }: EntityHeaderItemsProps) {
  const { name, reference_link } = assayMetadata;
  return (
    <>
      <Typography>{name}</Typography>
      <Typography>{reference_link}</Typography>
    </>
  );
}

function GeneItems({ data: { assayMetadata } }: EntityHeaderItemsProps) {
  const { name } = assayMetadata;
  return <Typography>{name}</Typography>;
}

const entityToFieldsMap: EntityToFieldsType = {
  Donor: DonorItems,
  Sample: SampleItems,
  Dataset: DatasetItems,
  Publication: PublicationItems,
  CellType: CellTypeItems,
  Gene: GeneItems,
};

const AnimatedStack = animated(Stack);

const vizNotebookIdSelector: (state: { vizNotebookId: string | null }) => string | null = (state) =>
  state.vizNotebookId;

function HuBMAPIDItem({ hubmap_id }: Pick<Entity, 'hubmap_id'>) {
  const handleCopyClick = useHandleCopyClick();

  return (
    <EntityHeaderItem text={hubmap_id}>
      <TooltipIconButton onClick={() => handleCopyClick(hubmap_id)} tooltip="Copy HuBMAP ID">
        <ContentCopyIcon sx={(theme) => ({ color: theme.palette.common.link, fontSize: '1.25rem' })} />
      </TooltipIconButton>
    </EntityHeaderItem>
  );
}

const entityStoreSelector = (state: EntityStore) => ({
  assayMetadata: state.assayMetadata,
  summaryComponentObserver: state.summaryComponentObserver,
});

const visualizationSelector = (state: VisualizationStore) => ({
  vizIsFullscreen: state.vizIsFullscreen,
});

function EntityHeaderContent({ view, setView }: { view: SummaryViewsType; setView: (v: SummaryViewsType) => void }) {
  const {
    assayMetadata,
    summaryComponentObserver: { summaryInView },
  } = useEntityStore(entityStoreSelector);

  const { entity } = useFlaskDataContext();
  const { hubmap_id, entity_type, uuid, mapped_data_access_level } = entity;

  const vizNotebookId = useVisualizationStore(vizNotebookIdSelector);
  const { vizIsFullscreen } = useVisualizationStore(visualizationSelector);

  const styles = useSpring({
    from: { opacity: 1 },
    to: {
      opacity: !summaryInView || view !== 'narrow' ? 1 : 0,
    },
  });

  const type = entity_type || assayMetadata.entity_type;
  const ItemsComponent = entityTypeHasIcon(type) ? entityToFieldsMap?.[type] : undefined;

  return (
    <Stack
      direction="row"
      alignItems="center"
      px={2}
      py={0.5}
      sx={(theme) => ({ ...(view !== 'narrow' && { borderBottom: `1px solid ${theme.palette.primary.lowEmphasis}` }) })}
    >
      {ItemsComponent && (
        <AnimatedStack style={styles} direction="row" alignItems="center">
          <StyledSvgIcon component={entityIconMap[type]} />
          {hubmap_id && <HuBMAPIDItem hubmap_id={hubmap_id} />}
          <ItemsComponent data={{ assayMetadata, entity }} />
        </AnimatedStack>
      )}
      <RightDiv>
        {vizIsFullscreen ? (
          <>
            {vizNotebookId && <VisualizationNotebookButton uuid={vizNotebookId} />}
            <VisualizationShareButtonWrapper />
            <VizualizationThemeSwitch />
            <VisualizationCollapseButton />
          </>
        ) : (
          <EntityHeaderActionButtons
            showJsonButton
            entityCanBeSaved
            uuid={uuid}
            entity_type={entity_type}
            hubmap_id={hubmap_id}
            mapped_data_access_level={mapped_data_access_level}
            view={view}
            setView={setView}
          />
        )}
      </RightDiv>
    </Stack>
  );
}

export default EntityHeaderContent;
