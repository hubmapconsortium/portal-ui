import React from 'react';
import { animated, useSpring } from '@react-spring/web';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import Stack from '@mui/material/Stack';

import VizualizationThemeSwitch from 'js/components/detailPage/visualization/VisualizationThemeSwitch';
import VisualizationCollapseButton from 'js/components/detailPage/visualization/VisualizationCollapseButton';
import VisualizationNotebookButton from 'js/components/detailPage/visualization/VisualizationNotebookButton';
import { AllEntityTypes, entityIconMap } from 'js/shared-styles/icons/entityIconMap';
import { useHandleCopyClick } from 'js/hooks/useCopyText';
import { TooltipIconButton } from 'js/shared-styles/buttons/TooltipButton';
import useEntityStore, { type EntityStore, SummaryViewsType } from 'js/stores/useEntityStore';
import { useVisualizationStore, type VisualizationStore } from 'js/stores/useVisualizationStore';
import { useFlaskDataContext } from 'js/components/Contexts';
import { Entity } from 'js/components/types';
import {
  getDonorMetadata,
  getSampleCategories,
  getDataTypes,
  getPublicationTitle,
  getPublicationVenue,
  getOriginSampleAndMappedOrgan,
} from '../../utils';

import { StyledSvgIcon, RightDiv } from './style';
import EntityHeaderItem from '../EntityHeaderItem';
import VisualizationShareButtonWrapper from '../VisualizationShareButtonWrapper';
import EntityHeaderActionButtons from '../EntityHeaderActionButtons';
import StatusIcon from '../../StatusIcon';

type EntityTypesWithIcons = Exclude<
  keyof typeof entityIconMap,
  'Support' | 'Collection' | 'Workspace' | 'VerifiedUser'
>;

export interface AssayMetadata extends Pick<Entity, 'mapped_data_access_level'> {
  entity_type: AllEntityTypes;
  name: string;
  reference_link: React.ReactNode;
  citationTitle?: string;
}

type EntityToFieldsType = Record<
  EntityTypesWithIcons,
  Record<string, (assayMetadata: Partial<AssayMetadata> & Entity) => React.ReactNode>
>;

const entityTypeHasIcon = (entityType: string): entityType is EntityTypesWithIcons => {
  return entityType in entityIconMap;
};

const entityToFieldsMap: EntityToFieldsType = {
  Donor: {
    sex: (e) => getDonorMetadata(e)?.sex,
    race: (e) => getDonorMetadata(e)?.race?.join(', '),
    age: (e) => {
      const age_value = getDonorMetadata(e)?.age_value;
      const age_unit = getDonorMetadata(e)?.age_unit;
      return age_value && age_unit ? `${age_value} ${age_unit}` : '';
    },
  },
  Sample: {
    'organ type': (e) => getOriginSampleAndMappedOrgan(e)?.mapped_organ,
    'sample category': getSampleCategories,
  },
  Dataset: {
    'data type': getDataTypes,
    'organ type': (e) => getOriginSampleAndMappedOrgan(e)?.mapped_organ,
    status: ({ status, mapped_data_access_level }) =>
      status &&
      mapped_data_access_level && (
        <>
          <StatusIcon status={status} /> {status} ({mapped_data_access_level})
        </>
      ),
  },
  Publication: {
    title: getPublicationTitle,
    'publication venue': getPublicationVenue,
  },
  CellType: {
    name: ({ name }) => name,
    reference_link: ({ reference_link }) => reference_link,
  },
  Gene: {
    name: ({ name }) => name,
  },
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

  return (
    <Stack
      direction="row"
      alignItems="center"
      px={2}
      py={0.5}
      sx={(theme) => ({ ...(view !== 'narrow' && { borderBottom: `1px solid ${theme.palette.primary.lowEmphasis}` }) })}
    >
      {entity_type && (
        <AnimatedStack style={styles} direction="row" alignItems="center">
          <StyledSvgIcon component={entityIconMap[entity_type]} />
          {hubmap_id && <HuBMAPIDItem hubmap_id={hubmap_id} />}
          {entityTypeHasIcon(entity_type) && entityToFieldsMap[entity_type]
            ? Object.entries(entityToFieldsMap[entity_type]).map(([label, fn]) => {
                const text = fn({ ...assayMetadata, ...entity });
                return text ? <EntityHeaderItem text={text} key={label} /> : null;
              })
            : null}
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
