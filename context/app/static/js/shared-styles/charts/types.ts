import { TickRendererProps } from '@visx/axis/lib/types';

export type FormattedValue = TickRendererProps['formattedValue'];
export interface TooltipData<Datum> {
  key: FormattedValue;
  bar?: { data: Datum };
}

/**
 * If the key is present in the bar data, then the tooltip is showing a specific bar's value
 * @param tooltipData - the tooltip data object
 * @returns true if the tooltip data has a bar and the key is present in the bar data
 */
export function tooltipHasBarData<Datum>(
  tooltipData: TooltipData<Datum>,
): tooltipData is TooltipData<Datum> & { key: string; bar: { data: Datum & Record<string, React.ReactNode> } } {
  if (
    tooltipData.bar &&
    tooltipData.key &&
    tooltipData.bar.data &&
    typeof tooltipData.bar.data === 'object' &&
    tooltipData.key in tooltipData.bar.data
  ) {
    return true;
  }
  return false;
}

export type TooltipComponentType<T> = React.ComponentType<{ tooltipData: TooltipData<T> }>;

/**
 * If the key is not present in the bar data, but the data is available, then the tooltip is showing tick label data
 * @param tooltipData - the tooltip data object
 * @returns true if the tooltip data has a bar and the key is not present in the bar data
 */
export function tooltipHasTickLabelData<Datum>(
  tooltipData: TooltipData<Datum>,
): tooltipData is TooltipData<Datum> & { key: string; bar: { data: Datum & Record<string, React.ReactNode> } } {
  if (
    tooltipData.bar &&
    tooltipData.key &&
    tooltipData.bar.data &&
    typeof tooltipData.bar.data === 'object' &&
    !(tooltipData.key in tooltipData.bar.data)
  ) {
    return true;
  }
  return false;
}
