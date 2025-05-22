import { CellTypeCountForTissue } from 'js/api/scfind/useCellTypeCountForTissue';
import React, { FocusEventHandler, MouseEventHandler } from 'react';
import { percent } from 'js/helpers/number-format';
import { ScaleLinear } from 'd3';

interface FractionRectProps {
  label: string;
  index: number;
  isTargetedCellType: boolean;
  isHoveredCellType: boolean;
  scale: ScaleLinear<number, number, never>;
  xOffsets: number[];
  onMouseEnter: MouseEventHandler<SVGRectElement>;
  onMouseLeave: () => void;
  totalCellCount: number;
  sortedData: CellTypeCountForTissue[];
  targetColorScale: (label: string) => string;
  otherColorScale: (label: string) => string;
}

export default function FractionRect({
  label,
  index,
  isTargetedCellType,
  isHoveredCellType,
  scale,
  xOffsets,
  onMouseEnter,
  onMouseLeave,
  sortedData,
  totalCellCount,
  targetColorScale,
  otherColorScale,
}: FractionRectProps) {
  return (
    <rect
      width={scale(sortedData[index].cell_count)}
      x={xOffsets[index]}
      height={isTargetedCellType ? 40 : 30}
      y={isTargetedCellType ? 5 : 10}
      fill={isTargetedCellType ? targetColorScale(label) : otherColorScale(label)}
      rx={isTargetedCellType ? 5 : 0}
      ry={isTargetedCellType ? 5 : 0}
      filter={isHoveredCellType ? 'brightness(120%) drop-shadow(0px 0px 5px rgba(0, 0, 0, 0.5))' : undefined}
      style={{ transition: 'filter 0.2s ease-in-out' }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onFocus={onMouseEnter as unknown as FocusEventHandler<SVGRectElement>}
      onBlur={onMouseLeave}
      aria-label={`${label}: ${sortedData[index].cell_count} (${percent.format(
        sortedData[index].cell_count / totalCellCount,
      )}`}
    />
  );
}
