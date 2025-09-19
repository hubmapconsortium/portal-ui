import React, { ReactNode } from 'react';
import { animated, useSpring } from '@react-spring/web';
import ContentCopyIcon from '@mui/icons-material/ContentCopyRounded';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';

import VisualizationThemeSwitch from 'js/components/detailPage/visualization/VisualizationThemeSwitch';
import VisualizationCollapseButton from 'js/components/detailPage/visualization/VisualizationCollapseButton';
import VisualizationWorkspaceButton from 'js/components/detailPage/visualization/VisualizationWorkspaceButton';
import { AllEntityTypes, entityIconMap } from 'js/shared-styles/icons/entityIconMap';
import OrganIcon from 'js/shared-styles/icons/OrganIcon';
import { SampleCategoryIcon } from 'js/shared-styles/icons';
import { useHandleCopyClick } from 'js/hooks/useCopyText';
import { TooltipIconButton } from 'js/shared-styles/buttons/TooltipButton';
import useEntityStore, { type EntityStore, SummaryViewsType } from 'js/stores/useEntityStore';
import { useVisualizationStore, type VisualizationStore } from 'js/stores/useVisualizationStore';
import { useFlaskDataContext } from 'js/components/Contexts';
import { Entity, isDataset, isDonor, isPublication, isSample } from 'js/components/types';
import EntityIcon from 'js/shared-styles/icons/EntityIcon';
import { useTrackEntityPageEvent } from 'js/components/detailPage/useTrackEntityPageEvent';
import DonorAgeTooltip from 'js/shared-styles/tooltips/DonorAgeTooltip';
import { OrganFile } from 'js/components/organ/types';
import OutboundIconLink from 'js/shared-styles/Links/iconLinks/OutboundIconLink';
import ViewEntitiesButton from 'js/components/organ/ViewEntitiesButton';
import { getDonorMetadata, getOriginSampleAndMappedOrgan } from '../../utils';
import EntityHeaderItem from '../EntityHeaderItem';

import { StyledSvgIcon, RightDiv } from './style';
import VisualizationShareButtonWrapper from '../VisualizationShareButtonWrapper';
import EntityHeaderActionButtons from '../EntityHeaderActionButtons';
import StatusIcon from '../../StatusIcon';

type EntityTypesWithIcons = Exclude<
  keyof typeof entityIconMap,
  'Support' | 'Collection' | 'Workspace' | 'WorkspaceTemplate' | 'VerifiedUser'
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

type EntityToFieldsType = Partial<
  Record<EntityTypesWithIcons, (props: EntityHeaderItemsProps) => React.ReactNode | null>
>;

const entityTypeHasIcon = (entityType: string): entityType is EntityTypesWithIcons => {
  return entityType in entityIconMap;
};

function DonorItems({ data: { entity } }: EntityHeaderItemsProps) {
  if (!isDonor(entity)) {
    return null;
  }

  const donorMetadata = getDonorMetadata(entity);

  const { sex, race, age_unit, age_value } = donorMetadata;

  if (Object.keys(donorMetadata).length === 0) {
    return null;
  }

  return (
    <>
      {sex && <Typography>{sex}</Typography>}
      {race && <Typography>{race}</Typography>}
      {age_unit && age_value && (
        <Typography>
          <DonorAgeTooltip donorAge={age_value}>
            {age_value} {age_unit}
          </DonorAgeTooltip>
        </Typography>
      )}
      <Divider orientation="vertical" flexItem />
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
      <EntityHeaderItem startIcon={<OrganIcon organName={mapped_organ} />}>{mapped_organ}</EntityHeaderItem>
      <EntityHeaderItem startIcon={<SampleCategoryIcon />}>{sample_category}</EntityHeaderItem>
      <Divider orientation="vertical" flexItem />
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
      <EntityHeaderItem startIcon={<EntityIcon entity_type={entity_type} />}>{assay_display_name}</EntityHeaderItem>
      <EntityHeaderItem startIcon={<OrganIcon organName={mapped_organ} />}>{mapped_organ}</EntityHeaderItem>
      <EntityHeaderItem startIcon={<StatusIcon status={status} />}>
        {status} ({mapped_data_access_level})
      </EntityHeaderItem>
      <Divider orientation="vertical" flexItem />
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
      <Divider orientation="vertical" flexItem />
    </>
  );
}

function CellTypeItems({ data: { assayMetadata } }: EntityHeaderItemsProps) {
  const { reference_link } = assayMetadata;
  return (
    <>
      <Typography>{reference_link}</Typography>
      <Divider orientation="vertical" flexItem />
    </>
  );
}

const entityToFieldsMap: EntityToFieldsType = {
  Donor: DonorItems,
  Sample: SampleItems,
  Dataset: DatasetItems,
  Publication: PublicationItems,
  CellType: CellTypeItems,
};

function EntityHeaderItems({ type, ...rest }: { type: EntityTypesWithIcons } & EntityHeaderItemsProps) {
  const Items = entityToFieldsMap[type];

  if (!Items) {
    return null;
  }

  return <Items {...rest} />;
}

const AnimatedStack = animated(Stack);

function HuBMAPIDItem({ title, entityTypeIcon }: { title: string } & { entityTypeIcon: ReactNode }) {
  const handleCopyClick = useHandleCopyClick();

  return (
    <EntityHeaderItem
      endIcon={
        <TooltipIconButton onClick={() => handleCopyClick(title)} tooltip="Copy ID">
          <ContentCopyIcon sx={(theme) => ({ color: theme.palette.common.link, fontSize: '1.25rem' })} />
        </TooltipIconButton>
      }
      startIcon={entityTypeIcon}
    >
      {title}
    </EntityHeaderItem>
  );
}

const entityStoreSelector = (state: EntityStore) => ({
  assayMetadata: state.assayMetadata,
  summaryComponentObserver: state.summaryComponentObserver,
  organFile: state.organFile,
});

const visualizationSelector = (state: VisualizationStore) => ({
  vizIsFullscreen: Boolean(state.fullscreenVizId),
  vizNotebookId: state.vizNotebookId,
  isVitessce: Boolean(state.vitessceVisualization),
});

function OrganItem({ organ }: { organ: OrganFile }) {
  const trackEntityPageEvent = useTrackEntityPageEvent('Organ Detail Page');
  const handleASCTBClick = () => {
    if (organ?.name) {
      trackEntityPageEvent({
        action: 'ASCT+B Reporter Navigation',
        label: organ.name,
      });
    }
  };

  const handleUberonClick = () => {
    if (organ?.name) {
      trackEntityPageEvent({
        action: 'Uberon Ontology Navigation',
        label: organ.name,
      });
    }
  };

  return (
    <>
      <EntityHeaderItem startIcon={<OrganIcon organName={organ.name} />}>{organ.name}</EntityHeaderItem>
      {organ.asctb && (
        <EntityHeaderItem>
          <OutboundIconLink href={organ.asctb} onClick={handleASCTBClick} underline="none" variant="body2">
            ASCT+B Reporter
          </OutboundIconLink>
        </EntityHeaderItem>
      )}
      {organ.uberon && (
        <EntityHeaderItem>
          <OutboundIconLink href={organ.uberon} onClick={handleUberonClick} underline="none" variant="body2">
            Uberon Ontology
          </OutboundIconLink>
        </EntityHeaderItem>
      )}
    </>
  );
}

function OrganButtons({ organ }: { organ: OrganFile }) {
  return (
    <Stack direction="row" spacing={1}>
      <ViewEntitiesButton
        entityType="Dataset"
        filters={{ organTerms: organ.search }}
        trackingInfo={{ action: 'View Datasets', label: organ.name }}
      />
      <ViewEntitiesButton
        entityType="Sample"
        filters={{ organTerms: organ.search }}
        trackingInfo={{ action: 'View Samples', label: organ.name }}
      />
    </Stack>
  );
}

function EntityHeaderContent({ view, setView }: { view: SummaryViewsType; setView: (v: SummaryViewsType) => void }) {
  const {
    assayMetadata,
    summaryComponentObserver: { summaryInView },
    organFile: organ,
  } = useEntityStore(entityStoreSelector);

  const { entity } = useFlaskDataContext();
  const { hubmap_id, entity_type } = entity;

  const isOrganPage = Boolean(organ);

  const { vizIsFullscreen, vizNotebookId, isVitessce } = useVisualizationStore(visualizationSelector);

  const styles = useSpring({
    from: { opacity: 1 },
    to: {
      opacity: !summaryInView || view !== 'narrow' ? 1 : 0,
    },
  });

  const title = isOrganPage ? organ?.name : (hubmap_id ?? assayMetadata?.name);
  const type = isOrganPage ? 'Organ' : (entity_type ?? assayMetadata?.entity_type);

  return (
    <Stack
      direction="row"
      alignItems="center"
      height="3rem"
      px={2}
      py={0.5}
      sx={(theme) => ({ ...(view !== 'narrow' && { borderBottom: `1px solid ${theme.palette.primary.lowEmphasis}` }) })}
    >
      <AnimatedStack
        style={styles}
        direction="row"
        alignItems="center"
        spacing={2}
        useFlexGap
        divider={<Divider orientation="vertical" flexItem />}
      >
        {isOrganPage && organ ? (
          <OrganItem organ={organ} />
        ) : (
          entityTypeHasIcon(type) && (
            <>
              {title && <HuBMAPIDItem title={title} entityTypeIcon={<StyledSvgIcon as={entityIconMap[type]} />} />}
              <EntityHeaderItems type={type} data={{ assayMetadata, entity }} />
            </>
          )
        )}
      </AnimatedStack>
      <RightDiv>
        {vizIsFullscreen && (
          <>
            {vizNotebookId && <VisualizationWorkspaceButton />}
            {isVitessce && <VisualizationShareButtonWrapper />}
            <VisualizationThemeSwitch trackingInfo={{ action: 'Vitessce' }} />
            <VisualizationCollapseButton />
          </>
        )}
        {!vizIsFullscreen && !isOrganPage && entityTypeHasIcon(type) && (
          <EntityHeaderActionButtons view={view} setView={setView} entity_type={type} />
        )}
        {!vizIsFullscreen && isOrganPage && organ && <OrganButtons organ={organ} />}
      </RightDiv>
    </Stack>
  );
}

export default EntityHeaderContent;
