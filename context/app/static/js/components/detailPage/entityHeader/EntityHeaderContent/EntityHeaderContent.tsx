import React from 'react';
import { animated, useSpring } from '@react-spring/web';

import VizualizationThemeSwitch from 'js/components/detailPage/visualization/VisualizationThemeSwitch';
import VisualizationCollapseButton from 'js/components/detailPage/visualization/VisualizationCollapseButton';
import VisualizationNotebookButton from 'js/components/detailPage/visualization/VisualizationNotebookButton';
import { AllEntityTypes, entityIconMap } from 'js/shared-styles/icons/entityIconMap';
import useVisualizationStore from 'js/stores/useVisualizationStore';
import { StyledSvgIcon, FlexContainer, RightDiv } from './style';
import EntityHeaderItem from '../EntityHeaderItem';
import VisualizationShareButtonWrapper from '../VisualizationShareButtonWrapper';

type EntityTypesWithIcons = Exclude<
  keyof typeof entityIconMap,
  'Support' | 'Collection' | 'Workspace' | 'VerifiedUser'
>;

export interface AssayMetadata {
  sex: string;
  race: string[];
  age_value: string;
  age_unit: string;
  mapped_organ: string;
  sample_category: string;
  mapped_data_types: string[];
  title: string;
  publication_venue: string;
  hubmap_id: string;
  entity_type: AllEntityTypes;
  name: string;
  reference_link: React.ReactNode;
}

type EntityToFieldsType = Record<
  EntityTypesWithIcons,
  Record<string, (assayMetadata: Partial<AssayMetadata>) => React.ReactNode>
>;

const entityTypeHasIcon = (entityType: string): entityType is EntityTypesWithIcons => {
  return entityType in entityIconMap;
};

const entityToFieldsMap: EntityToFieldsType = {
  Donor: {
    sex: ({ sex }) => sex,
    race: ({ race }) => race?.join(', '),
    age: ({ age_value, age_unit }) => (age_value && age_unit ? `${age_value} ${age_unit}` : ''),
  },
  Sample: {
    'organ type': ({ mapped_organ }) => mapped_organ,
    'sample category': ({ sample_category }) => sample_category,
  },
  Dataset: {
    'organ type': ({ mapped_organ }) => mapped_organ,
    'data type': ({ mapped_data_types }) => mapped_data_types?.join(', '),
  },
  Publication: {
    title: ({ title }) => title,
    'publication venue': ({ publication_venue }) => publication_venue,
  },
  CellType: {
    name: ({ name }) => name,
    reference_link: ({ reference_link }) => reference_link,
  },
  Gene: {
    name: ({ name }) => name,
  },
};

const AnimatedFlexContainer = animated(FlexContainer);

const vizNotebookIdSelector: (state: { vizNotebookId: string | null }) => string | null = (state) =>
  state.vizNotebookId;

interface EntityHeaderContentProps {
  assayMetadata: Partial<AssayMetadata>;
  shouldDisplayHeader: boolean;
  vizIsFullscreen: boolean;
}

function EntityHeaderContent({ assayMetadata, shouldDisplayHeader, vizIsFullscreen }: EntityHeaderContentProps) {
  const styles = useSpring({
    opacity: shouldDisplayHeader || vizIsFullscreen ? 1 : 0,
  });

  const { hubmap_id, entity_type } = assayMetadata;

  const vizNotebookId = useVisualizationStore(vizNotebookIdSelector);

  return (
    <AnimatedFlexContainer style={styles} maxWidth={vizIsFullscreen ? false : 'lg'}>
      {entity_type && (
        <>
          <StyledSvgIcon component={entityIconMap[entity_type]} />
          <EntityHeaderItem text={hubmap_id} />
          {entityTypeHasIcon(entity_type) && entityToFieldsMap[entity_type]
            ? Object.entries(entityToFieldsMap[entity_type]).map(([label, fn]) => (
                <EntityHeaderItem
                  text={React.isValidElement(fn) ? fn : fn(assayMetadata) ?? `undefined ${label}`}
                  key={label}
                />
              ))
            : null}
        </>
      )}
      {vizIsFullscreen && (
        <RightDiv>
          {vizNotebookId && <VisualizationNotebookButton uuid={vizNotebookId} />}
          <VisualizationShareButtonWrapper />
          <VizualizationThemeSwitch />
          <VisualizationCollapseButton />
        </RightDiv>
      )}
    </AnimatedFlexContainer>
  );
}

export default EntityHeaderContent;
