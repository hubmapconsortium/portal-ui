declare module '*.yaml' {
  const data: unknown;
  export default data;
}

declare module 'metadata-field-entities' {
  const data: Record<string, string>;
  export default data;
}

declare module 'metadata-field-descriptions' {
  const data: Record<string, string>;
  export default data;
}

declare module 'metadata-field-types' {
  const data: Record<string, string>;
  export default data;
}

declare module 'metadata-field-assays' {
  const data: Record<string, string[]>;
  export default data;
}
