import { useTheme } from "@emotion/react";

import { TableRow, tableRowClasses, tableCellClasses } from "@mui/material";

import { useBoolean } from "src/hooks/use-boolean";

import { varAlpha } from "src/theme/styles";

function RowStyles({children, selected, style='default'}) {
    const theme = useTheme();
    const details = useBoolean();

    const defaultStyles = {
      borderTop: `solid 1px ${varAlpha(theme.vars.palette.grey['500Channel'], 0.16)}`,
      borderBottom: `solid 1px ${varAlpha(theme.vars.palette.grey['500Channel'], 0.16)}`,
      '&:first-of-type': {
        borderTopLeftRadius: 16,
        borderBottomLeftRadius: 16,
        borderLeft: `solid 1px ${varAlpha(theme.vars.palette.grey['500Channel'], 0.16)}`,
      },
      '&:last-of-type': {
        borderTopRightRadius: 16,
        borderBottomRightRadius: 16,
        borderRight: `solid 1px ${varAlpha(theme.vars.palette.grey['500Channel'], 0.16)}`,
      }
    };
    
    if (style === 'paper') {
      return (
        <TableRow
          className="row"
            selected={selected}
            sx={{
            borderRadius: 2,
            [`&.${tableRowClasses.selected}, &:hover`]: {
                backgroundColor: 'background.paper',
                boxShadow: theme.customShadows.z20,
                transition: theme.transitions.create(['background-color', 'box-shadow'], {
                duration: theme.transitions.duration.shortest,
                }),
                '&:hover': { backgroundColor: 'background.paper', boxShadow: theme.customShadows.z20 },
            },
            [`& .${tableCellClasses.root}`]: { ...defaultStyles },
            ...(details.value && { [`& .${tableCellClasses.root}`]: { ...defaultStyles } }),
        }
    }>{children}</TableRow>
      );
    }
    return (<TableRow className="row" hover selected={selected} aria-checked={selected} tabIndex={-1}>{children}</TableRow>)
}


export function RegularRowProvider({children, selected, columns, style='default'}) {

  const actionsBefore = columns.filter(col => col.before).map((col, index) => (
    <col.component key={index} {...col.props} />
  ));

  const actionsAfter = columns.filter(col => !col.before).map((col, index) => (
    <col.component key={index} {...col.props} />
  ));


  return (
    
    <RowStyles  selected={selected} style={style}>
      {actionsBefore}
      {children}
      {actionsAfter}
    </RowStyles>
  )
}