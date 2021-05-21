function getImmediateDatasetAncestors(immediate_ancestors) {
  return immediate_ancestors.reduce(
    (acc, ancestor) => (ancestor.entity_type === 'Dataset' ? [...acc, ancestor.uuid] : acc),
    [],
  );
}

export { getImmediateDatasetAncestors };
