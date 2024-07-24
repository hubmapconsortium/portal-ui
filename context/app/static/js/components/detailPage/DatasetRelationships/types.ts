import { Node } from '@xyflow/react';

export type NodeWithoutPosition<T extends Record<string, unknown> = Record<string, unknown>> = Omit<
  Node<T>,
  'position'
>;
