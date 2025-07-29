/*-
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Badge from '@mui/material/Badge';
import Drawer from '@mui/material/Drawer';
import Divider from '@mui/material/Divider';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';

import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';

import { FilterElement } from '../manager/manager-filters';


// ----------------------------------------------------------------------

export function ProfileFilter({ filtersOptions, data, open, onOpen, onClose, filters, handleFilters }) {

    const renderFilters = (
        <>
            {filtersOptions.filter(e => e.options.length > 1 && !e.id.includes('Q') || e.id === 'event').map(ele =>
                <Box display="flex" flexDirection="column">
                    <Typography variant="subtitle2" sx={{ mb: 1.5 }}>
                        {ele.label}
                    </Typography>
                    <FilterElement
                        filters={filters}
                        info={ele}
                        handleFilters={handleFilters}
                        value={filters[ele.id]}
                    />
                </Box>)
            }
        </>

    );
    const renderHead = (
        <>
            <Box display="flex" alignItems="center" sx={{ py: 2, pr: 1, pl: 2.5 }}>
                <Typography variant="h6" sx={{ flexGrow: 1 }}>
                    סינון
                </Typography>

                <Tooltip title="איפוס פילטרים">
                    <IconButton onClick={() => null}>
                        <Badge color="error" variant="dot" invisible={false}>
                            <Iconify icon="solar:restart-bold" />
                        </Badge>
                    </IconButton>
                </Tooltip>

                <IconButton onClick={onClose}>
                    <Iconify icon="mingcute:close-line" />
                </IconButton>
            </Box>

            <Divider sx={{ borderStyle: 'dashed' }} />
        </>
    )

    return (
        <Drawer
            anchor="right"
            open={open}
            onClose={onClose}
            slotProps={{ backdrop: { invisible: true } }}
            PaperProps={{ sx: { width: 320 } }}
        >
            {renderHead}
            <Scrollbar sx={{ px: 2.5, py: 3 }}>
                <Stack spacing={3}>
                    {renderFilters}
                </Stack>
            </Scrollbar>
        </Drawer>
    );
}

-*/