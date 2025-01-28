import React from 'react';
import { AllEntityTypes } from 'js/shared-styles/icons/entityIconMap';
import { useSelectableTableStore } from 'js/shared-styles/tables/SelectableTableProvider';
import SaveEntitiesButton from 'js/components/savedLists/SaveEntitiesButton';

export default function SaveEntitiesButtonFromSearch({ entity_type }: { entity_type: AllEntityTypes }) {
  const { selectedRows } = useSelectableTableStore();

  return <SaveEntitiesButton uuids={selectedRows} entity_type={entity_type} useSelectableTableTooltips />;
}
