import React, { useMemo } from 'react';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';

import OutboundLink from 'js/shared-styles/Links/OutboundLink';
import useSearchData from 'js/hooks/useSearchData';
import VerticalGroupedStackedBarChart from 'js/shared-styles/charts/VerticalStackedBarChart/VerticalGroupedStackedBarChart';
import ChartWrapper from 'js/shared-styles/charts/ChartWrapper/ChartWrapper';
import { useBandScale, useLinearScale, useOrdinalScale } from 'js/shared-styles/charts/hooks';
import { ChartPaper, ChartTitle, DescriptionPaper } from './style';
import {
  getKeyValues,
  getAgeLabels,
  makeCompositeQuery,
  makeHistogramSource,
  makeTermSource,
  getBloodTypeLabels,
  CompositeQuery,
} from './utils';
import { useDonorChartData, CompositeAggregations, CompositeBucket } from './hooks';
import DonorChartTooltip from './DonorChartTooltip';

function ucFirst(str: string): string {
  return `${str[0].toUpperCase()}${str.slice(1)}`;
}

function pretty(str: string): string {
  return str.split('_').map(ucFirst).join(' ');
}

function BloodTypeDescription() {
  return (
    <>
      It is critical to be aware that{' '}
      <OutboundLink href="https://www.redcrossblood.org/donate-blood/blood-types.html">
        some blood types are more common than others
      </OutboundLink>{' '}
      in a racially diverse population like the United States. The blood type of an individual can{' '}
      <OutboundLink href="https://www.pennmedicine.org/updates/blogs/health-and-wellness/2019/april/blood-types">
        predispose them to different kinds of medical conditions
      </OutboundLink>
      .
    </>
  );
}

type LabelFunction = (buckets: CompositeBucket[], key: string) => string[];

const labelsMap: Record<string, LabelFunction> = {
  'mapped_metadata.age': getAgeLabels,
  'mapped_metadata.abo_blood_group_system': getBloodTypeLabels,
};

interface LowLevelDonorChartProps {
  title: string;
  donorQuery: CompositeQuery;
  xKey: string;
  yKey: string;
  colorKeys: string[];
  description: React.ReactNode;
  xAxisLabel: string;
}

function LowLevelDonorChart({
  title,
  donorQuery,
  xKey,
  yKey,
  colorKeys,
  description,
  xAxisLabel,
}: LowLevelDonorChartProps) {
  const { palette } = useTheme();
  const colors = [palette.primary.main, palette.success.main, palette.error.main];

  const { searchData } = useSearchData<Record<string, unknown>, CompositeAggregations>(donorQuery);

  const { xAxisLabels, compareByKeys } = useMemo(() => {
    if (!searchData.aggregations?.composite_data?.buckets) {
      return { xAxisLabels: [], compareByKeys: [] };
    }

    const { buckets } = searchData.aggregations.composite_data;
    const labelFn = labelsMap[xKey] ?? getKeyValues;
    const labels = labelFn(buckets, xKey).map(String);

    return {
      xAxisLabels: labels,
      compareByKeys: colorKeys,
    };
  }, [searchData, xKey, colorKeys]);

  const { data, maxCount } = useDonorChartData({
    searchData: { aggregations: searchData.aggregations },
    xKey,
    yKey,
    xAxisLabels,
    compareByKeys,
  });

  const xScale = useBandScale(xAxisLabels, { padding: 0.1 });
  const yScale = useLinearScale([0, maxCount], { nice: true });

  const colorScale = useOrdinalScale(compareByKeys, {
    domain: compareByKeys,
    range: colors.slice(0, compareByKeys.length),
  });

  const graphMargin = { top: 40, right: 20, bottom: 80, left: 60 };

  if (!searchData.aggregations) {
    return null;
  }

  return (
    <>
      <ChartTitle variant="h4">{title}</ChartTitle>
      {description && (
        <DescriptionPaper>
          <Typography>{description}</Typography>
        </DescriptionPaper>
      )}
      <ChartPaper>
        <ChartWrapper margin={graphMargin} colorScale={colorScale}>
          <VerticalGroupedStackedBarChart
            data={data}
            xScale={xScale}
            yScale={yScale}
            colorScale={colorScale}
            getX={(d) => d.group}
            margin={graphMargin}
            xAxisTickLabels={xAxisLabels}
            compareByKeys={compareByKeys}
            stackKeys={['count']}
            yAxisLabel="# of Donors"
            xAxisLabel={xAxisLabel}
            TooltipContent={DonorChartTooltip}
            simpleGroupedMode
          />
        </ChartWrapper>
      </ChartPaper>
    </>
  );
}

const xAxisLabelMap: Record<string, string> = {
  'mapped_metadata.abo_blood_group_system': 'ABO Blood Group',
};

type XAxisOption = 'age' | 'abo_blood_group_system' | 'sex';
type GroupsOption = 'race' | 'sex';

interface DonorChartProps {
  xAxis: XAxisOption;
  groups: GroupsOption;
}

function DonorChart({ xAxis, groups }: DonorChartProps) {
  const xSource = xAxis === 'age' ? makeHistogramSource(xAxis) : makeTermSource(xAxis);
  const ySource = makeTermSource(groups);
  const donorQuery = makeCompositeQuery(xSource, ySource);
  const xKey = `mapped_metadata.${xAxis}`;
  const yKey = `mapped_metadata.${groups}`;

  const colorKeysMap: Record<GroupsOption, string[]> = {
    race: ['White', 'Black or African American', 'Hispanic'],
    sex: ['Male', 'Female'],
  };

  const colorKeys = colorKeysMap[groups];
  const xAxisLabel = xAxisLabelMap[xKey] ?? pretty(xAxis);
  const title = `${xAxisLabel} & ${pretty(groups)}`;
  const description = [xAxis, groups].includes('abo_blood_group_system') ? <BloodTypeDescription /> : null;

  return (
    <LowLevelDonorChart
      donorQuery={donorQuery}
      xKey={xKey}
      yKey={yKey}
      colorKeys={colorKeys}
      title={title}
      xAxisLabel={xAxisLabel}
      description={description}
    />
  );
}

export default DonorChart;
