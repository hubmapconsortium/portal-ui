function getSharedColumns() {
  return {
    displayDOICol: { id: 'hubmap_id', label: 'HuBMAP ID' },
    descendantCountsCol: { id: 'descendant_counts.entity_type.Dataset', label: 'Derived Dataset Count' },
    createdTimestampCol: { id: 'created_timestamp', label: 'Creation Date' },
  };
}

export { getSharedColumns };
