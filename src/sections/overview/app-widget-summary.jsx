import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import { useTheme } from '@mui/material/styles';

import { fNumber, fPercent } from 'src/utils/format-number';

import { Iconify } from 'src/components/iconify';
import { Chart, useChart } from 'src/components/chart';

// ----------------------------------------------------------------------
import Autoplay from 'embla-carousel-autoplay';

import Link from '@mui/material/Link';

import Typography from '@mui/material/Typography';

import { varAlpha } from 'src/theme/styles';

import { Image } from 'src/components/image';
import {
  Carousel,
  useCarousel,
  CarouselDotButtons,
  CarouselArrowBasicButtons,
} from 'src/components/carousel';
import { Grid } from '@mui/material';

// ----------------------------------------------------------------------

export function AppWidgetSummary({ list, sx, ...other }) {
  const carousel = useCarousel({
    align: 'center',
    loop: true,
    dragFree: true,
    slideSpacing: '20px',
    direction: 'rtl',
    slidesToShow: { xs: 1, sm: 2, md: '32%' },
  }, [Autoplay({ playOnInit: false, delay: 2000 })]);

  return (
    <>


         
<Box sx={{ position: 'relative', p: 0, m: 0 }}>
      <Carousel carousel={carousel}>
        {list.map((item) => (
        
          <CarouselItem title={item.title} percent={item.percent} total={item.total} chart={item.chart} sx={item.sx} {...other} />
        ))}
        
      </Carousel>
                  <CarouselDotButtons
              scrollSnaps={carousel.dots.scrollSnaps}
              selectedIndex={carousel.dots.selectedIndex}
              onClickDot={carousel.dots.onClickDot}
              sx={{ top: 16, right: 16, position: 'absolute', color: 'common.white' }}
            />
      </Box>
    </>
  );
}

// ----------------------------------------------------------------------

export function CarouselItem({ title, percent, total, chart, sx, ...other }) {
  const theme = useTheme();

  const chartColors = chart.colors ?? [theme.palette.primary.main];

  const chartOptions = useChart({
    chart: { sparkline: { enabled: true } },
    colors: chartColors,
    stroke: { width: 0 },
    xaxis: { categories: chart.categories },
    tooltip: {
      y: { formatter: (value) => fNumber(value), title: { formatter: () => '' } },
    },
    plotOptions: { bar: { borderRadius: 1.5, columnWidth: '64%' } },
    ...chart.options,
  });

  const renderTrending = (
    <Box sx={{ gap: 0.5, display: 'flex', alignItems: 'center' }}>
      <Iconify
        width={24}
        icon={
          percent < 0
            ? 'solar:double-alt-arrow-down-bold-duotone'
            : 'solar:double-alt-arrow-up-bold-duotone'
        }
        sx={{ flexShrink: 0, color: 'success.main', ...(percent < 0 && { color: 'error.main' }) }}
      />

      <Box component="span" sx={{ typography: 'subtitle2' }}>
        {percent > 0 && '+'}
        {fPercent(percent)}
      </Box>
      <Box component="span" sx={{ typography: 'body2', color: 'text.secondary' }}>
        יותר מ-7 ימים
      </Box>
    </Box>
  );

  return (
    <Card
      sx={{
        display: 'flex',
        alignItems: 'center',
        p: 3,
        ...sx,
      }}
      {...other}
    >
      <Box sx={{ flexGrow: 1 }}>
        <Box sx={{ typography: 'subtitle2' }}>{title}</Box>
        <Box sx={{ mt: 1.5, mb: 1, typography: 'h3' }}>{fNumber(total)}%</Box>
        {renderTrending}
      </Box>

      <Chart
        type="bar"
        series={[{ data: chart.series }]}
        options={chartOptions}
        width={60}
        height={40}
      />
    </Card>
  );
}
