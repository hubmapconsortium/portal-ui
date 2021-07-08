function getSharedColumns() {
  return {
    displayDOICol: { id: 'hubmap_id', label: 'HuBMAP ID' },
    descendantCountsCol: { id: 'descendant_counts.entity_type.Dataset', label: 'Derived Dataset Count' },
    lastModifiedTimestampCol: { id: 'last_modified_timestamp', label: 'Last Modified' },
  };
}

export { getSharedColumns };
