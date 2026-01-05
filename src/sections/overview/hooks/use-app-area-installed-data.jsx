import { useCallback, useEffect, useMemo, useState } from 'react';

import { useSuspenseQuery } from '@tanstack/react-query';

import { apiSummary } from 'src/actions/summary';
import { apiInfoStudents } from 'src/actions/info_students';

import { groupBy } from 'src/sections/profile/profile-main';
import { getAllYear } from 'src/utils/hebrew/getter';
// ----------------------------------------------------------------------

function getSelectedSeriesData(selectedSeries, infoStudents) {
  return infoStudents.map((item) => ({ student_id: item.student_id, [selectedSeries]: item[selectedSeries] }));
}

function mergeSelectedSeriesIntoSummary(selectedSeries, infoStudents, summaryData, isDay) {
  const info = getSelectedSeriesData(selectedSeries, infoStudents);
  const hebrewDates = getAllYear()
  
  return summaryData.map((summaryItem) => {
    const infoItem = info.find((i) => i.student_id === summaryItem.student_id);
    const r = {
      ...summaryItem,
      [selectedSeries]: infoItem ? infoItem[selectedSeries] : null,
    }
    if (isDay) {
      const hebrewDate = hebrewDates.find((d) => d.יום === summaryItem.day);
      return {...r, ...hebrewDate}
    }
    return r
  });
}

function checkGroup(infoStudents) {
  if (!infoStudents || infoStudents.length === 0) return [];

  const columns = Object.keys(infoStudents[0]);
  return columns.filter((col) => {
    const uniqueValues = new Set(infoStudents.map((item) => item[col]));
    return uniqueValues.size <= 20;
  });
}

const demoSummaryForm = {
  events: ['חסידות', 'גמרא', 'תפילה'],
  start: '2025-11-01',
  end: '2026-01-02',
  group_by: ['event_name'],
  type: 'mean',
  days: ['2025-12-31', '2026-01-02'],
  format: 'records',
};

export function useAppAreaInstalledData(summaryForm) {

    const summaryFormFinal = summaryForm || demoSummaryForm;
    summaryFormFinal.format = 'records';
    const group_by = summaryFormFinal.group_by[0];


    const { data: summaryData } = useSuspenseQuery(apiSummary(summaryFormFinal));
  
    const { data: infoStudents } = useSuspenseQuery(apiInfoStudents());

    const uniqueColumns = useMemo(() => {
    const columns = checkGroup(infoStudents);
    if (group_by == 'day'){
        return [...columns, 'פרשת_השבוע', 'חודש_עברי', 'יום_בשבוע' ];
    }
    return checkGroup(infoStudents)
    }
    , [infoStudents, group_by]);

    const defaultSeries = uniqueColumns[3] ?? uniqueColumns[0] ?? null;

    const [selectedSeries, setSelectedSeries] = useState(defaultSeries);

    useEffect(() => {
        if (!uniqueColumns.length) {
      if (selectedSeries !== null) {
        setSelectedSeries(null);
      }
      return;
    }

    if (!selectedSeries || !uniqueColumns.includes(selectedSeries)) {
      setSelectedSeries(defaultSeries);
    }
  }, [defaultSeries, selectedSeries, uniqueColumns]);

  const mergedData = useMemo(() => {
    if (!selectedSeries) {
      return summaryData;
    }
    const isDay = group_by === 'day'

    return mergeSelectedSeriesIntoSummary(selectedSeries, infoStudents, summaryData, isDay);
  }, [infoStudents, selectedSeries, summaryData]);

  console.log({mergedData})
  const groupedData = useMemo(() => {
    if (!selectedSeries) {
      return [];
    }
    return groupBy(mergedData, [group_by, selectedSeries], 'data', 'average');
  }, [mergedData, selectedSeries]);

  const categories = useMemo(() => [...new Set(groupedData.map((item) => item[group_by]))], [groupedData]);

  const uniqueSelectedSeriesValues = useMemo(
    () => [...new Set(groupedData.map((item) => item[selectedSeries]))],
    [groupedData, selectedSeries]
  );

  const chartData = useMemo(() => {
    if (!selectedSeries) {
      return { categories: [], series: [] };
    }

    const series = [
      {
        name: selectedSeries,
        data: uniqueSelectedSeriesValues.map((value) => ({
          name: value,
          fullName: `${selectedSeries} - ${value}`,
          data: groupedData.filter((item) => item[selectedSeries] === value).map((item) => item.data_average),
        })),
      },
    ];

    return {
      categories,
      series,
    };
  }, [categories, groupedData, selectedSeries, uniqueSelectedSeriesValues]);

  console.log({chartData})

  const currentSeries = useMemo(
    () => chartData.series.find((item) => item.name === selectedSeries),
    [chartData.series, selectedSeries]
  );

  const legendLabels = useMemo(
    () => chartData.series?.[0]?.data?.map((item) => item.name) || [],
    [chartData.series]
  );

  const handleChangeSeries = useCallback((newValue) => {
    setSelectedSeries(newValue);
  }, []);

  return {
    chartData,
    currentSeries,
    handleChangeSeries,
    legendLabels,
    selectedSeries,
    uniqueColumns,
    groupedData,
    mergedData,
    summaryData,
    infoStudents,
    uniqueSelectedSeriesValues,
    setSelectedSeries,
    group_by
  };
}