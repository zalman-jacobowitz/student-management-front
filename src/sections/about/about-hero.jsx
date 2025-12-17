import { m } from 'framer-motion';

import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import { CONFIG } from 'src/config-global';

import { varFade, AnimateText, MotionContainer, animateTextClasses } from 'src/components/animate';
import { useTheme } from '@mui/material';

// ----------------------------------------------------------------------

export function AboutHero({ sx, ...other }) {
  const theme = useTheme()
  return (
    <Box
      component="section"
      sx={{
        height: { md: 560 },
        py: { xs: 10, md: 0 },
        overflow: 'hidden',
        position: 'relative',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        fontFamily: theme.typography.fontFamily,
        backgroundImage: `url(${CONFIG.assetsDir}/assets/background/overlay.svg), url(${CONFIG.assetsDir}/assets/images/about/hero.webp)`,
        ...sx,
      }}
      {...other}
    >
      <Container component={MotionContainer}>
        <Box
          sx={{
            bottom: { md: 80 },
            position: { md: 'absolute' },
            textAlign: { xs: 'center', md: 'unset' },
          }}
        >
          <AnimateText
            component="h1"
            variant="h1"
            text={['מי', 'אנחנו?']}
            variants={varFade({ distance: 24 }).inRight}
            sx={{
              color: 'common.white',
              [`& .${animateTextClasses.line}[data-index="0"]`]: {
                [`& .${animateTextClasses.word}[data-index="0"]`]: {
                  color: 'primary.main',
                },
              },
            }}
          />

          <m.div variants={varFade({ distance: 24 }).inUp}>
            <Typography
              variant="h4"
              sx={{
                mt: 3,
                color: 'common.white',
                fontWeight: 'fontWeightSemiBold',
              }}
            >
              בואו נעבוד ביחד ו
              <br /> ניצור אתר מדהים בקלות
            </Typography>
          </m.div>
        </Box>
      </Container>
    </Box>
  );
}
