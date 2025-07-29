/*-
import Grid from '@mui/material/Unstable_Grid2';
import { Skeleton, Stack } from '@mui/material';
import { useSettingsContext } from 'src/components/settings';
import Container from '@mui/material/Container';
import { Scrollbar } from 'src/components/scrollbar';

export function SkeletonProfile() {

  const settings = useSettingsContext();

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>

      <Grid container spacing={3}>
        <Grid xs={12} md={3}>
          <Skeleton variant='text' animation="wave" sx={{ height: 60, mr: 10 }} />
          <Skeleton variant='text' animation="wave" sx={{ height: 40 }} />
        </Grid>
        <Grid xs={12} md={12}>
          <Skeleton variant='rounded' animation="wave" sx={{ height: 310 }} />
        </Grid>
        <Grid xs={12} md={4}>
          <Stack spacing={3}>
            <Skeleton variant='rounded' animation="wave" sx={{ height: 470 }} />
          </Stack>
        </Grid>
        <Grid xs={12} md={6} lg={8}>
          <Skeleton variant='rounded' animation="wave" sx={{ height: 470 }} />
        </Grid>
        <Grid xs={12} md={6} lg={8}>
          <Skeleton variant='rounded' animation="wave" sx={{ height: 470 }} />
        </Grid>
        <Grid xs={12} md={4} spacing={5}>
          <Scrollbar sx={{ height: 480 }}>
            <Stack sx={{ pb: 2 }}>
              <Skeleton variant='rounded' animation="wave" sx={{ height: 200 }} />
            </Stack>
            <Stack sx={{ pb: 2 }}>
              <Skeleton variant='rounded' animation="wave" sx={{ height: 200 }} />
            </Stack>
            <Stack sx={{ pb: 2 }}>
              <Skeleton variant='rounded' animation="wave" sx={{ height: 200 }} />
            </Stack>
            <Stack sx={{ pb: 2 }}>
              <Skeleton variant='rounded' animation="wave" sx={{ height: 200 }} />
            </Stack>
          </Scrollbar>
        </Grid>
        <Grid xs={12} md={4} lg={4}>
          <Skeleton variant='rounded' animation="wave" sx={{ height: 470 }} />
        </Grid>
        <Grid xs={12} md={8} lg={8}>
          <Skeleton variant='rounded' animation="wave" sx={{ height: 470 }} />
        </Grid>
      </Grid>
    </Container>
  )
}



-*/