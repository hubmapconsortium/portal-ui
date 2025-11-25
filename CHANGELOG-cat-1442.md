# Migrate provenance graph visualization from @hms-dbmi-bgm/react-workflow-viz to @xyflow/react

## What changed

- Replaced `@hms-dbmi-bgm/react-workflow-viz` library with `@xyflow/react` for rendering provenance graphs
- Created new data conversion utilities to transform PROV-JSON directly to ReactFlow nodes/edges
- Implemented custom node types for entities and activities using patterns from DatasetRelationships
- Updated `useProvenanceStore` to manage nodes/edges instead of CWL steps
- Removed dependency on intermediate CWL format conversion
- Updated detail panel to display on node selection instead of built-in sidebar
- Removed old library CSS imports

## Why

- Consolidate on a single graph visualization library (@xyflow/react) used across the application
- Simplify data transformation pipeline by eliminating CWL intermediate format
- Improve maintainability by using a more actively maintained and modern library
- Enable future enhancements with ReactFlow's extensive feature set

## Files changed

### New files

- `context/app/static/js/components/detailPage/provenance/utils/provToNodesAndEdges.ts` - PROV-JSON to ReactFlow conversion
- `context/app/static/js/components/detailPage/provenance/utils/applyLayout.ts` - Dagre layout algorithm
- `context/app/static/js/components/detailPage/provenance/nodeTypes/NodeTemplate.tsx` - Reusable node template
- `context/app/static/js/components/detailPage/provenance/nodeTypes/index.tsx` - Entity and Activity node components

### Modified files

- `context/app/static/js/components/detailPage/provenance/ProvVis/ProvVis.tsx` - Use ReactFlow instead of GraphParser/Graph
- `context/app/static/js/components/detailPage/provenance/ProvGraph/ProvGraph.tsx` - Updated to display detail panel on selection
- `context/app/static/js/components/detailPage/provenance/ProvGraph/DetailPanel.tsx` - Removed old library CSS import
- `context/app/static/js/components/detailPage/provenance/ProvGraph/style.ts` - Updated styles for ReactFlow container
- `context/app/static/js/components/detailPage/provenance/ShowDerivedEntitiesButton/ShowDerivedEntitiesButton.jsx` - Updated to work with nodes/edges
- `context/app/static/js/stores/useProvenanceStore.ts` - Store nodes/edges instead of CWL steps

### Preserved files (for backward compatibility)

- `context/app/static/js/components/detailPage/provenance/ProvVis/ProvData.ts` - `toCwl()` method no longer used but kept for potential rollback

## Testing considerations

- Verify provenance graph renders correctly for various entity types (Donor, Sample, Dataset)
- Test "Show Derived Entities" button functionality
- Confirm current entity is marked with asterisk (\*)
- Validate node selection shows correct detail panel information
- Test graph controls (zoom, pan, fitView)
- Verify performance with large provenance trees
