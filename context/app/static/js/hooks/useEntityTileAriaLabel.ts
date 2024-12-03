import { useMemo } from 'react';

interface EntityTile {
  entity_type: string;
  hubmap_id: string;
  origin_samples_unique_mapped_organs?: string[];
  group_name?: string | undefined;
  sample_category?: string | undefined;
  assay_display_name?: string[] | undefined;
}

export const useEntityTileAriaLabelText = (entities: EntityTile[] | EntityTile): string | string[] => {
  return useMemo(() => {
    const formatTileLabel = (entity: EntityTile): string => {
      const {
        entity_type,
        hubmap_id,
        group_name,
        origin_samples_unique_mapped_organs,
        sample_category,
        assay_display_name,
      } = entity;

      const organ = origin_samples_unique_mapped_organs?.join(' ') ?? '';
      const assay = assay_display_name?.join(' ') ?? '';

      const labelMap: Record<string, string> = {
        Dataset: `Tile representing dataset with id ${hubmap_id} for organ ${organ} and assay_type ${assay}`,
        Sample: `Tile representing sample with id ${hubmap_id} for organ ${organ}, sample category ${sample_category}, and group ${group_name}`,
        Donor: `Tile representing donor with id ${hubmap_id} and group ${group_name}`,
      };

      return labelMap[entity_type] || `Tile representing ${entity_type} with id ${hubmap_id}`;
    };

    if (Array.isArray(entities)) {
      return entities.map(formatTileLabel);
    }
    return formatTileLabel(entities);
  }, [entities]);
};
