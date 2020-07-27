import { useMemo } from 'react';

function useDescendantCounts(entityData, types) {
  const descendantCounts = useMemo(() => {
    // use Map to preserve insertion order
    if (entityData) {
      const counts = new Map();
      types.reduce((acc, type) => {
        acc[type] = entityData.descendants.filter((d) => d.entity_type === type).length;
        return acc;
      }, counts);
      return counts;
    }
    return {};
  }, [types, entityData]);
  return descendantCounts;
}

export default useDescendantCounts;
