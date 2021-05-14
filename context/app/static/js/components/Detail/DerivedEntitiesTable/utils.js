function getColumnNames(entityType) {
  const idColumn = { id: 'display_doi', label: 'HuBMAP ID' };

  const finalSharedColumns = [
    { id: 'descendant_counts.entity_type.Dataset', label: 'Derived Dataset Count' },
    { id: 'last_modified_timestamp', label: 'Last Modified' },
  ];

  const entitySpecificColumns = {
    Dataset: [
      { id: 'mapped_data_types', label: 'Data Types' },
      { id: 'status', label: 'Status' },
    ],
    Sample: [
      { id: 'origin_sample.mapped_organ', label: 'Organ' },
      { id: 'mapped_specimen_type', label: 'Specimen' },
    ],
  };

  return [idColumn, ...entitySpecificColumns[entityType], ...finalSharedColumns];
}

export { getColumnNames };
