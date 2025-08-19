import { useSuspenseQuery } from "@tanstack/react-query";

import { Box, Stack, Avatar, useTheme, ListItemText } from "@mui/material";

import { InfoStudent } from "src/serverTypes";
import { varAlpha, bgGradient } from "src/theme/styles";
import { apiInfoColumns } from "src/actions/info_columns";

import { descriptionColumns, getDesc } from "../insert/functions";


const avatarUrl = 'assets/images/mock/avatar/avatar-4.webp'; // 'avatar-4.webp'
const coverUrl = 'assets/images/mock/cover/cover-4.webp'// 'cover-4.webp'

export function ProfileCover({ studentInfo }: { studentInfo: InfoStudent }) {
  const infoColumns = useSuspenseQuery(apiInfoColumns());
  const infoDetails = descriptionColumns(infoColumns.data)
  console.log({studentInfo});
  const primary = infoDetails.primary.map(e=> studentInfo[e]).join(' ') 
  const secondary = infoDetails.secondary.map(e=> studentInfo[e]).join(' ')
  console.log({secondary})
  const theme = useTheme();

  return (
    <Box
      sx={{
        ...bgGradient({
          color: `0deg, ${varAlpha(theme.vars.palette.primary.darkerChannel, 0.8)}, ${varAlpha(theme.vars.palette.primary.darkerChannel, 0.8)}`,
          imgUrl: coverUrl,
        }),
        height: 1,
        color: 'common.white',
      }}
    >
      <Stack
        direction={{ xs: 'column', md: 'row' }}
        sx={{
          left: { md: 24 },
          bottom: { md: 24 },
          zIndex: { md: 10 },
          pt: { xs: 6, md: 0 },
          position: { md: 'absolute' },
        }}
      >
        <Avatar
          alt=''
          src=''
          sx={{
            mx: 'auto',
            width: { xs: 64, md: 128 },
            height: { xs: 64, md: 128 },
            border: `solid 2px ${theme.vars.palette.common.white}`,
          }}
        />

        <ListItemText
          sx={{ mt: 3, ml: { md: 3 }, textAlign: { xs: 'center', md: 'unset' } }}
          primary={primary}
          secondary={secondary}
          primaryTypographyProps={{ typography: 'h4' }}
          secondaryTypographyProps={{
            mt: 0.5,
            color: 'inherit',
            component: 'span',
            typography: 'body2',
            sx: { opacity: 0.48 },
          }}
        />
      </Stack>
    </Box>
  );
}