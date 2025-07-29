import {
  useSuspenseQueries,
} from '@tanstack/react-query';

import { apiInfoColumns } from './info_columns';
import { apiSelectOptions } from './select_options';


/* --------------------------------------------------
 | Utility: attach <select> options to column schema |
 --------------------------------------------------*/
export function createSelectOptions(infoCols, selectOpts) {
  return infoCols.map((col) => {
    if (col.type === 'select') {
      return {
        ...col,
        options: selectOpts
          .filter((o) => o.name === col.name)
          .map((o) => ({ value: o.value, label: o.label })),
      };
    }
    return col;
  });
}


/* --------------------------------------------------
 | Public hook – consumes the suspense queries       |
 --------------------------------------------------*/
export function useInfoColumns(tableName) {
  const [infoColumnsQ, selectOptionsQ] = useSuspenseQueries({
    queries: [apiInfoColumns(), apiSelectOptions()],
  });

  const infoColumnsData = infoColumnsQ.data ?? [];
  const selectOptionsData = selectOptionsQ.data ?? [];

  const infoThisTable = infoColumnsData
    .filter((c) => c.table_name === tableName)
    .sort((a, b) => a.sorting - b.sorting);

  const selectThisTable = selectOptionsData.filter(
    (o) => o.table_name === tableName
  );

  const newData = createSelectOptions(infoThisTable, selectThisTable);

  return { infoColumns: infoColumnsData, selectOptions: selectOptionsData, newData };
}
