function getFilterProps({ field, title, filterType }) {
  return {
    componentId: `${field}-filter`,
    dataField: `${field}.keyword`,
    title,
    filterType,
  };
}

function getFieldProps({ field, title }) {
  return {
    field,
    title,
  };
}

export { getFieldProps, getFilterProps };
