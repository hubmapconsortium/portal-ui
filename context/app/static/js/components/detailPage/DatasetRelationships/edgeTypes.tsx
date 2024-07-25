import React from 'react';
import { BaseEdge, EdgeProps, EdgeTypes, getStraightPath } from '@xyflow/react';

function DefaultEdge({ sourceX, sourceY, targetX, targetY, ...props }: EdgeProps) {
  const [path] = getStraightPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
  });
  return <BaseEdge {...props} path={path} markerEnd="arrow" />;
}

export const edgeTypes: EdgeTypes = {
  default: DefaultEdge,
};
