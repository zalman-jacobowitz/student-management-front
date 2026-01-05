import { Box, Grid, Button, Typography, Fab, Tooltip } from "@mui/material";
import { MotionContainer, varFade, varBounce, AnimateText } from "src/components/animate";
import { useWalktour, Walktour } from "src/components/walktour";
import { Iconify } from "src/components/iconify";
import { TEXTS } from "../explantions";
import { textGradient, responsiveFontSizes } from "src/theme/styles";
import { useTheme } from "@emotion/react";
import { CONFIG } from "src/config-global";

export function Welcome() {

    const theme = useTheme();
  
    return (
    <MotionContainer>
      <Grid 
        container 
        spacing={{ sm: 2, md: 3, lg: 3 }} 
        alignItems="center"
        sx={{
          px: { sm: 2, md: 3, lg: 4 },
          py: { sm: 3, md: 4, lg: 5 },
        }}
      >
        <Grid 
          item 
          sm={12}
          md={6}  
          sx={{ 
            display: 'flex', 
            mt: { sm: 2, md: 3, lg: 5 },
            justifyContent: 'center',
            minHeight: { sm: '250px', md: '350px', lg: '450px' },
          }}
        >
          <Box
            padding={{ sm: 2, md: 2.5, lg: 3 }}
            component="img"
            src={`${CONFIG.assetsDir}/assets/illustrations/illustration-dashboard.webp`}
            sx={{
              maxWidth: '100%',
              width: { sm: '280px', md: '380px', lg: '500px' },
              height: 'auto',
              animation: 'float 3s ease-in-out infinite',
              '@keyframes float': {
                '0%, 100%': { transform: 'translateY(0px)' },
                '50%': { transform: 'translateY(-20px)' },
              },
            }}
          />
        </Grid>
        <Grid 
          item 
          sm={12}
          md={6} 
          sx={{ 
            display: 'flex', 
            mb: { sm: 2, md: 3, lg: 5 },
            flexDirection: 'column', 
            alignItems: 'center',
            justifyContent: 'center',
            px: { sm: 1.5, md: 2, lg: 0 },
          }}
        >
          <AnimateText
            text={TEXTS.welcome}
            variants={varFade().in}
            component="h3"
            sx={{
              opacity: 0.5, 
              textAlign: 'center',
              ...responsiveFontSizes({ sm: 14, md: 16, lg: 18 }),
            }}
            variant="h3"
            gutterBottom
          />
          <AnimateText
            color='primary'
            text={'ניהול תלמידים'}
            variants={varBounce().inUp}
            sx={{
              textAlign: 'center',
              typography: 'h1',
              opacity: 0.95,
              ...responsiveFontSizes({ sm: 32, md: 42, lg: 56 }),
              lineHeight: { sm: 1.3, md: 1.4, lg: 1.5 },
              my: { sm: 1.5, md: 2, lg: 2.5 },
              ...textGradient(
                `to right, ${theme.vars.palette.warning.light}, ${theme.vars.palette.primary.main}`
              ),
            }}
            component="h3"
            variant="h3"
            gutterBottom
          />

          <AnimateText
            text={TEXTS.subwelcome}
            sx={{
              textAlign: 'center',
              ...responsiveFontSizes({ sm: 14, md: 16, lg: 18 }),
              lineHeight: { sm: 1.5, md: 1.6, lg: 1.7 },
              px: { sm: 1, md: 2, lg: 0 },
              ...textGradient(
                `to left, ${theme.vars.palette.primary.main}, ${theme.vars.palette.primary.dark}`
              ),
            }}
            variants={varFade().inUp}
            component="h6"
            variant="h6"
            gutterBottom
          />
        </Grid>
      </Grid>
    </MotionContainer>
  );
}
