import { 
  List, 
  ListItem, 
  ListItemButton, 
  ListItemIcon, 
  ListItemText, 
  Chip, 
  Typography, 
  Stack,
} from "@mui/material";

import { Iconify } from "src/components/iconify";

import { InfoColumn } from "src/serverTypes";
import { getChips } from "./columns-minimal-fucntions";



function ColumnChip({ chip }: { chip: any }) {
  return (
    <Chip
      size="small"
      label={chip.label}
      icon={chip.icon ? <Iconify icon={chip.icon} width={14} /> : undefined}
      color={chip.color || 'default'}
      variant='soft'
      sx={{
        fontSize: '0.70rem',
        height: 20,
        '& .MuiChip-icon': {
          fontSize: '0.75rem'
        }
      }}
    />
  );
}

export function ColumnRow({column, handleColumnClick}: {column: InfoColumn}) {
  const columnChips = getChips(column);

  const renderTypeIcon = (<ListItemIcon>
                    <Iconify 
                      icon={columnChips.type.icon} 
                      width={24} 
                      sx={{ color: 'primary.main' }}
                    />
                  </ListItemIcon>)

  const renderChips = Object.keys(columnChips).map((chip, index) => (
    <ColumnChip key={index} chip={columnChips[chip]} />
  ));

  const renderPrimary = 
  (<Stack direction="row" alignItems="center" spacing={1}>
                        <Typography variant="subtitle2">
                          {column.label || column.name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          ({column.name})
                        </Typography>
                      </Stack>
  )
  return (
          <ListItem key={column.name} disablePadding>
            <ListItemButton
              onClick={() => handleColumnClick(column)}
              sx={{ 
                  borderRadius: 1,
                  mb: 0.5,
                  '&:hover': {
                      backgroundColor: 'action.hover',
                    }
                  }}
                >
                  {renderTypeIcon}
                <ListItemText 
                    primary={renderPrimary}
                    secondary={
                      <Stack 
                        direction="row" 
                        alignItems="center" 
                        spacing={0.5} 
                        sx={{ mt: 0.5, flexWrap: 'wrap', gap: 0.5 }}
                      >
                        {renderChips}
                      </Stack>
                    }
                  />
                  <Iconify 
                    icon="solar:alt-arrow-left-bold" 
                    width={20} 
                    sx={{ color: 'text.disabled' }}
                  />
                </ListItemButton>
              </ListItem>
            );
}

export function ColumnsList({columns, handleColumnClick}: {columns: InfoColumn[], handleColumnClick: (column: InfoColumn) => void}) {
  return (
    <List sx={{ maxHeight: 400, overflow: 'auto' }}>
      {columns?.map((column) => (
        <ColumnRow
          key={column.name}
          column={column}
          handleColumnClick={handleColumnClick}
        />
      ))}
    </List>
  );
}
