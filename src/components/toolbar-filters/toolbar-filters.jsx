import { FilterElement } from "src/components/filter-elements";

export function ToolbarFilters({infoColumns}){

  const fieldFilters = infoColumns.filter(e => e.filters === 'extra')
  const renderFilters = (
    <>
      {fieldFilters.map(col => (
          <FilterElement
            key={col.name}
            name={col.name}
            info={col}
          />
      ))}
    </>
  );
return renderFilters

}